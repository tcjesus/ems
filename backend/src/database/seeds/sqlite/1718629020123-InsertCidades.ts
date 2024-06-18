import { MigrationInterface, QueryRunner } from "typeorm";

import fs from 'fs'
import path from 'path'
import { EstadoModel } from "@/locality/models/EstadoModel";

export class InsertCidades1718629020123 implements MigrationInterface {

  private readCsv(csvFileName: string): string[][] {
    const csv = fs.readFileSync(path.resolve(__dirname, csvFileName), 'utf8')
    return csv.split('\n').map((line: string) => line.split(','))
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const estados = this.readCsv('../data/estados.csv').map((row) => ({
      nome: row[0],
      sigla: row[1]
    }))

    let estadosMap: Record<string, EstadoModel | null> = {}

    for (const estado of estados) {
      await queryRunner.manager.query(
        `INSERT INTO "estado" ("nome", "sigla") VALUES (?, ?)`,
        [estado.nome, estado.sigla],
      )
      estadosMap[estado.sigla] = await queryRunner.manager.findOne(EstadoModel, { where: { sigla: estado.sigla } })
    }

    const cidades = this.readCsv('../data/cidades.csv').map((row) => ({
      siglaEstado: row[0],
      codigoIbge: row[1],
      nome: row[2],
    }))

    for (const cidade of cidades) {
      const estado = estadosMap[cidade.siglaEstado]
      if (!estado) {
        throw new Error(`Estado com sigla '${cidade.siglaEstado}' não encontrado para a cidade '${cidade.nome}'`)
      }

      await queryRunner.manager.query(
        `INSERT INTO "cidade" ("codigo_ibge", "nome", "estado_id") VALUES (?, ?, ?)`,
        [cidade.codigoIbge, cidade.nome, estado.id],
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager.query('DELETE FROM "estado"')
  }
}
