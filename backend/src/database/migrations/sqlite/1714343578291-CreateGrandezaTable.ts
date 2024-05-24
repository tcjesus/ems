import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGrandezaTable1714343578291 implements MigrationInterface {
  name = 'CreateGrandezaTable1714343578291'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "grandeza" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "nome" varchar(50) NOT NULL, ' +
      '  "unidade_medida" varchar(50), ' +
      '  "sigla" varchar(20), ' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "deleted_at" datetime ' +
      ')'
    );
    await queryRunner.query('CREATE INDEX "IDX_54410094f950b7c8fb01e182d8" ON "grandeza" ("deleted_at") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_54410094f950b7c8fb01e182d8" ON "grandeza"');
    await queryRunner.query('DROP TABLE "grandeza"');
  }
}
