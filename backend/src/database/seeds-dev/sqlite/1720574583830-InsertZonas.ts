import { MigrationInterface, QueryRunner } from "typeorm";

import { CidadeModel } from "@/locality/models/CidadeModel";
import { LocalidadeModel } from "@/locality/models/LocalidadeModel";

const zonas = [
  { nome: 'Zona 1 (UEFS)', localidade: 'Feira de Santana' },
  { nome: 'Zona 2 (Centro)', localidade: 'Feira de Santana' },
  { nome: 'Zona 3 (SIM)', localidade: 'Feira de Santana' },
  { nome: 'Zona 4 (Tomba)', localidade: 'Feira de Santana' },
  { nome: 'Zona 5 (Vila Olimpia)', localidade: 'Feira de Santana' },
]

export class InsertZonas1720574583830 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const zona of zonas) {
      const cidade = await queryRunner.manager.findOne(CidadeModel, { where: { nome: zona.localidade } })
      if (!cidade) {
        throw new Error(`Cidade '${zona.localidade}' não encontrada`)
      }

      const localidade = await queryRunner.manager.findOne(LocalidadeModel, { where: { cidadeId: cidade.id } })
      if (!localidade) {
        throw new Error(`Localidade '${zona.localidade}' não encontrada`)
      }

      await queryRunner.manager.query(
        `INSERT INTO zona (nome, localidade_id) VALUES (?, ?)`,
        [zona.nome, localidade.id],
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const nomes = zonas.map((zona) => zona.nome)
    queryRunner.manager.query(
      `DELETE FROM zona WHERE nome IN (${nomes.map(() => '?').join(',')})`,
      nomes,
    )
  }
}
