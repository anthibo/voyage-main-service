import * as parser from 'csv-parse/sync';
import * as fs from 'fs';

export function readCsv(
  fileWithPath: string,
): Array<{ [key: string]: string }> {
  const strcsv = fs.readFileSync(fileWithPath, 'utf-8');

  const data = parser.parse(strcsv, {
    bom: true,
    cast: false,
    columns: true,
  });

  return data;
}