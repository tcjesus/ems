import { parse } from 'csv-parse/sync'
import * as fs from 'fs'

export class CsvHelper {
  public static parseSync = <T> (path: string): T => {
    const data = fs.readFileSync(path, {
      encoding: 'utf8',
      flag: 'r',
    })

    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
    })

    return records as T
  }
}
