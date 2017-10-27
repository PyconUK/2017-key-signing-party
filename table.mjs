import util from 'util';
import _ from 'lodash/fp';
import fs from 'mz/fs';
import glob from 'glob';
import yaml from 'js-yaml';
import markdownTable from 'markdown-table';

const previousAttendees = new Set([
  'Aaron Kirkbride',
  'Adam Johnson',
  'Amber Wright',
  'Benjamin Elis Misell',
  'Emmanuel Payet',
  'Fabio Natali',
  'Jonathan Burman',
  'Luca Valentini',
  'Mark Einon',
  'Matthew Power',
  'Michael Aquilina',
  'Roger G. Coram',
  'Samuel Reynolds',
  'Thomas David Newport',
  'Thomas Edwards',
  'Vipin Ajayakumar',
  'William Johnson',
]);

const globP = util.promisify(glob);

const chunkStr = n => _.flow(_.chunk(n), _.map(_.join('')));

const formatFpHalf = _.flow(
  chunkStr(4),
  _.join(' '),
)

const formatFingerprint = _.flow(
  _.replace(/(^0x|\s)/g, ''),
  _.toLower,
  chunkStr(20),
  _.map(formatFpHalf),
  _.join('  '),
);


const toTable = _.flow(
  _.reject(v => previousAttendees.has(v.name)),
  _.sortBy('name'),
  _.map(v => ([v.name, v.fingerprint, '', ''])),
)

async function row(filename) {
  const content = await fs.readFile(filename);
  const { name, fingerprint: rawFingerprint } = yaml.safeLoad(content);
  return { name, fingerprint: formatFingerprint(rawFingerprint)};
}



async function go() {
  try {
    const files = await globP('keys/*');
    const rows = await Promise.all(_.map(row, files));
    const tableRows = toTable(rows);
    console.log(markdownTable([
      ['name', 'fingerprint', 'fp verified', 'id verified'],
      ...tableRows,
    ]));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

go();
