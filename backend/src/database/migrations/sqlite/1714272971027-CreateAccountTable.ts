import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountTable1714272971027 implements MigrationInterface {
  name = 'CreateAccountTable1714272971027'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "account" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "nome" varchar(100), ' +
      '  "email" varchar(100), ' +
      '  "password" varchar(255), ' +
      '  "isSuperAdmin" boolean NOT NULL DEFAULT (0), ' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "deleted_at" datetime' +
      ')'
    );
    await queryRunner.query('CREATE INDEX "IDX_10389424cb6dac9dc4e8ee91c4" ON "account" ("deleted_at")');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_account_email" ON "account" ("email")');

    await queryRunner.query(
      'CREATE TABLE "permission" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "account_id" integer NOT NULL, ' +
      '  "localidade_id" integer NOT NULL, ' +
      '  "role" varchar(15) NOT NULL, ' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "deleted_at" datetime, ' +

      '  CONSTRAINT "FK_31385a732b9c8b16d06e768b9c9" FOREIGN KEY ("account_id") REFERENCES "account" ("id") ON DELETE CASCADE ON UPDATE CASCADE, ' +
      '  CONSTRAINT "FK_39db64e6aa036e2bcfa0470e529" FOREIGN KEY ("localidade_id") REFERENCES "localidade" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION' +
      ')'
    );
    await queryRunner.query('CREATE INDEX "IDX_051045d065c5f6f76343874085" ON "permission" ("deleted_at")');

    await queryRunner.query(
      'CREATE TABLE "audit" (' +
      '  "id" varchar PRIMARY KEY NOT NULL, ' +
      '  "account_id" integer NOT NULL, ' +
      '  "method" varchar(6) NOT NULL, ' +
      '  "resource" varchar(100) NOT NULL, ' +
      '  "query" text, ' +
      '  "params" text, ' +
      '  "request" text, ' +
      '  "old_record" text, ' +
      '  "response" text, ' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "deleted_at" datetime' +
      ')'
    );
    await queryRunner.query('CREATE INDEX "IDX_1067323d0494dd14952a0d8b72" ON "audit" ("deleted_at")');
    await queryRunner.query('CREATE INDEX "IDX_audit_account" ON "audit" ("account_id")');
    await queryRunner.query('CREATE INDEX "IDX_audit_method" ON "audit" ("method")');
    await queryRunner.query('CREATE INDEX "IDX_audit_resource" ON "audit" ("resource")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_audit_resource"');
    await queryRunner.query('DROP INDEX "IDX_audit_method"');
    await queryRunner.query('DROP INDEX "IDX_audit_account"');
    await queryRunner.query('DROP INDEX "IDX_1067323d0494dd14952a0d8b72"');
    await queryRunner.query('DROP INDEX "IDX_051045d065c5f6f76343874085"');
    await queryRunner.query('DROP INDEX "IDX_account_email"');
    await queryRunner.query('DROP INDEX "IDX_10389424cb6dac9dc4e8ee91c4"');
  }
}
