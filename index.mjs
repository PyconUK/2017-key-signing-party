import _ from 'lodash/fp';
import assert from 'assert';
import util from 'util';
import fs from 'mz/fs';
import openpgp from 'openpgp';
import glob from 'glob';
import yaml from 'js-yaml';
import addressRfc2822 from 'address-rfc2822';

function parse(id) {
  try {
    return Array.from(addressRfc2822.parse(id));
  } catch (e) {
    return [];
  }
}

const { HKP, key, armor, packet, enums } = openpgp;
const globP = util.promisify(glob);

const hkps = _.map(u => new HKP(u), [
  'http://ha.pool.sks-keyservers.net',
  'http://pgp.mit.edu',
  'http://keys.gnupg.net',
  'http://keyserver.ubuntu.com',
]);

function readPacketList(rawKey) {
  const { data } = armor.decode(rawKey);
  const packetList = new packet.List();
  packetList.read(data);
  return Array.from(packetList);
}

const userNamesFromKey = _.flow(
  readPacketList,
  Array.from,
  _.filter(v => v.tag === enums.packet.userid),
  _.map('userid'),
  _.flatMap(parse),
  _.map('phrase'),
  _.compact,
);

function parseYaml(content) {
  try {
    return yaml.safeLoad(content) || {};
  } catch (e) {
    return {};
  }
}

const lookup = _.curry(async (fingerprint, hkp) => {
  const options = { query: `0x${fingerprint}`};
  try {
    return await hkp.lookup(options);
  } catch (e) {
    return;
  }
})

async function read(filename) {
  try {
    return await fs.readFile(filename);
  } catch(e) {
    return '';
  }
}

async function validateFile(filename) {
  const content = await read(filename);
  const { name, fingerprint: rawFingerprint } = parseYaml(content);
  assert(
    typeof rawFingerprint === 'string',
    `fingerprint is not a string, note: keys must not start with 0x`,
  )
  const fingerprint = rawFingerprint.replace(/(^0x|\s)/g, '');
  assert(
    /[0-9a-fA-F]{40}/.test(fingerprint),
    `invalid fingerprint: ${fingerprint}`,
  );
  const results = await Promise.all(_.map(lookup(fingerprint), hkps));
  const rawKey = _.find(_.identity, results);
  assert(rawKey, `key does not exist on keyserver`);
  const userNames = userNamesFromKey(rawKey);
  assert(_.includes(name, userNames), `key missing name: ${name}`);
}

const filenameWhitelist = new Set(['package.json', 'package-lock.json']);

async function checkNotKey(filename) {
  if (filenameWhitelist.has(filename)) {
    return;
  }

  const content = await read(filename);
  const { name, fingerprint } = parseYaml(content);
  assert(
    !(name || fingerprint),
    `key ${filename} is in the wrong directory, it should be moved to keys/`,
  );
}

async function check(fn, path) {
  const files = await globP(path);
  const keys = await Promise.all(_.map(fn, files));
  return keys;
}

async function checkAllKeys() {
  const keys = await check(validateFile, 'keys/*');
  console.log(`checked ${keys.length} keys`);
}

async function checkKeysInWrongDir() {
  await check(checkNotKey, '*');
}

async function go() {
  try {
    await Promise.all([checkKeysInWrongDir(), checkAllKeys()]);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

go();
