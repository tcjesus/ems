import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountTable1714343577159 implements MigrationInterface {
  name = 'CreateAccountTable1714343577159'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "account" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,' +
      '  "nome" varchar(100),' +
      '  "email" varchar(100),' +
      '  "password" varchar(255),' +
      '  "role" varchar(15),' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')),' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')),' +
      '  "deleted_at" datetime ' +
      ')'
    );

    await queryRunner.query('CREATE INDEX "IDX_10389424cb6dac9dc4e8ee91c4" ON "account" ("deleted_at") ');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_account_email" ON "account" ("email") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_account_email" ON "account"');
    await queryRunner.query('DROP INDEX "IDX_10389424cb6dac9dc4e8ee91c4" ON "account"');
    await queryRunner.query('DROP TABLE "account"');
  }
}
