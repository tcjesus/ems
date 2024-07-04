import { MigrationInterface, QueryRunner } from "typeorm";

import { CidadeModel } from "@/locality/models/CidadeModel";

export class InsertLocalidade1716523573120 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const cidadeFeiraDeSantana = await queryRunner.manager.findOne(CidadeModel, { where: { nome: 'Feira de Santana' } })
    if (!cidadeFeiraDeSantana) {
      throw new Error("Cidade 'Feira de Santana' não encontrada")
    }

    await queryRunner.manager.query(
      `INSERT INTO "localidade" ("cidade_id") VALUES (?)`,
      [cidadeFeiraDeSantana.id],
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const cidadeFeiraDeSantana = await queryRunner.manager.findOne(CidadeModel, { where: { nome: 'Feira de Santana' } })
    if (!cidadeFeiraDeSantana) {
      throw new Error("Cidade 'Feira de Santana' não encontrada")
    }

    await queryRunner.manager.query(
      `DELETE FROM "localidade" WHERE "cidade_id" = ?`,
      [cidadeFeiraDeSantana.id],
    )
  }
}
