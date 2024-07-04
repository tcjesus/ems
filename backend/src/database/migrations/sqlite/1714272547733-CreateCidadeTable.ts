import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCidadeTable1714272547733 implements MigrationInterface {
  name = 'CreateCidadeTable1714272547733'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "estado" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "nome" varchar(50) NOT NULL, ' +
      '  "sigla" varchar(2) NOT NULL, ' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "deleted_at" datetime' +
      ')'
    );

    await queryRunner.query(
      'CREATE TABLE "cidade" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "codigo_ibge" varchar(15) NOT NULL, ' +
      '  "nome" varchar(50) NOT NULL, ' +
      '  "estado_id" integer NOT NULL, ' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "deleted_at" datetime, ' +

      '  CONSTRAINT "FK_838dba2bb71b4f93e237f1460bd" FOREIGN KEY ("estado_id") REFERENCES "estado" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION' +
      ')'
    );
    await queryRunner.query('CREATE INDEX "IDX_4262539bb6ef5b560e79be63ac" ON "cidade" ("deleted_at")');

    await queryRunner.query(
      'CREATE TABLE "localidade" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "cidade_id" integer NOT NULL, ' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "deleted_at" datetime, ' +

      '  CONSTRAINT "FK_d1d125adc54967df5e5eeb9f54c" FOREIGN KEY ("cidade_id") REFERENCES "cidade" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION' +
      ')'
    );
    await queryRunner.query('CREATE INDEX "IDX_5fcc81492fa234aed76e6519ea" ON "localidade" ("deleted_at")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_5fcc81492fa234aed76e6519ea"');
    await queryRunner.query('DROP INDEX "IDX_4262539bb6ef5b560e79be63ac"');
    await queryRunner.query('DROP TABLE "localidade"');
    await queryRunner.query('DROP TABLE "cidade"');
    await queryRunner.query('DROP TABLE "estado"');
  }
}
