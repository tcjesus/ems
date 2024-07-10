import { MigrationInterface, QueryRunner } from "typeorm";

import { CidadeModel } from "@/locality/models/CidadeModel";
import { LocalidadeModel } from "@/locality/models/LocalidadeModel";

const tiposEmergencia = [
  {
    nome: 'Incêndio',
    grandezas: ['Temperatura', 'Fumaça', 'Gás'],
    localidade: 'Feira de Santana',
  },
  {
    nome: 'Inundação',
    grandezas: ['Temperatura', 'Umidade'],
    localidade: 'Feira de Santana',
  },
  {
    nome: 'Deslizamento',
    grandezas: ['Temperatura', 'Umidade'],
    localidade: 'Feira de Santana',
  },
  {
    nome: 'Explosão',
    grandezas: ['Temperatura', 'Gás', 'Pressão'],
    localidade: 'Feira de Santana',
  },
]

export class InsertTiposEmergencia1720574038337 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const tipoEmergencia of tiposEmergencia) {
      const cidade = await queryRunner.manager.findOne(CidadeModel, { where: { nome: tipoEmergencia.localidade } })
      if (!cidade) {
        throw new Error(`Cidade '${tipoEmergencia.localidade}' não encontrada`)
      }

      const localidade = await queryRunner.manager.findOne(LocalidadeModel, { where: { cidadeId: cidade.id } })
      if (!localidade) {
        throw new Error(`Localidade '${tipoEmergencia.localidade}' não encontrada`)
      }

      const grandezas = await queryRunner.manager.query(
        `SELECT * FROM grandeza WHERE nome IN (${tipoEmergencia.grandezas.map(() => '?').join(',')})`,
        tipoEmergencia.grandezas,
      )

      if (grandezas.length !== tipoEmergencia.grandezas.length) {
        throw new Error(`Grandezas do tipo de emergência '${tipoEmergencia.nome}' não encontradas`)
      }

      await queryRunner.manager.query(
        `INSERT INTO tipo_emergencia (nome, localidade_id) VALUES (?, ?)`,
        [tipoEmergencia.nome, localidade.id],
      )

      const tipoEmergenciaId = await queryRunner.manager.query(
        `SELECT id FROM tipo_emergencia WHERE nome = ?`,
        [tipoEmergencia.nome],
      )

      for (const grandeza of grandezas) {
        await queryRunner.manager.query(
          `INSERT INTO tipo_emergencia_x_grandeza (tipo_emergencia_id, grandeza_id) VALUES (?, ?)`,
          [tipoEmergenciaId[0].id, grandeza.id],
        )
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tipoEmergenciaIds = await queryRunner.manager.query(
      `SELECT id FROM tipo_emergencia WHERE nome IN (${tiposEmergencia.map(() => '?').join(',')})`,
      tiposEmergencia.map((tipoEmergencia) => tipoEmergencia.nome),
    )

    if (tipoEmergenciaIds.length !== tiposEmergencia.length) {
      throw new Error('Tipos de emergência não encontrados')
    }

    await queryRunner.manager.query(
      `DELETE FROM tipo_emergencia_x_grandeza WHERE tipo_emergencia_id IN (${tipoEmergenciaIds.map(() => '?').join(',')})`,
      tipoEmergenciaIds.map((tipoEmergencia) => tipoEmergencia.id),
    )

    await queryRunner.manager.query(
      `DELETE FROM tipo_emergencia WHERE id IN (${tipoEmergenciaIds.map(() => '?').join(',')})`,
      tipoEmergenciaIds.map((tipoEmergencia) => tipoEmergencia.id),
    )
  }
}
