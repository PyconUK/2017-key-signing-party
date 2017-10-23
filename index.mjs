import _ from 'lodash/fp';
import assert from 'assert';
import util from 'util';
import fs from 'mz/fs';
import openpgp from 'openpgp';
import glob from 'glob';
import yaml from 'js-yaml';

const { HKP, key, armor, packet, enums } = openpgp;
const globP = util.promisify(glob);

const hkp = new HKP('http://ha.pool.sks-keyservers.net');

function readPacketList(rawKey) {
  const { data } = armor.decode(rawKey);
  const packetList = new packet.List();
  packetList.read(data);
  return Array.from(packetList);
}

const useridRe = () => /([^(]*) ((\([^)]*\)) )?(<[^>]*>)/;

const userNamesFromKey = _.flow(
  readPacketList,
  Array.from,
  _.filter(v => v.tag === enums.packet.userid),
  _.map(({ userid }) => {
    const match = useridRe().exec(userid);
    assert(match, `invalid key comment: ${userid}`);
    const [, name] = match;
    return name;
  }),
);

async function validateFile(filename) {
  const content = await fs.readFile(filename);
  const { name, fingerprint } = yaml.safeLoad(content);
  assert(
    /[0-9a-fA-F]{40}/.test(fingerprint),
    `invalid fingerprint: ${fingerprint}`,
  );
  const rawKey = await hkp.lookup({ query: `0x${fingerprint}`});
  assert(rawKey, `key does not exist on keyserver`);
  const userNames = userNamesFromKey(rawKey);
  assert(_.includes(name, userNames), `key missing name: ${name}`);
}

async function go() {
  try {
    const files = await globP('keys/*');
    const keys = await Promise.all(_.map(validateFile, files));
    console.log(`checked ${keys.length} keys`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

go();
