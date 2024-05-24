import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateZonaTable1714738381591 implements MigrationInterface {
  name = 'CreateZonaTable1714738381591'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "zona" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "nome" varchar(50) NOT NULL, ' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "deleted_at" datetime ' +
      ')'
    );
    await queryRunner.query('CREATE INDEX "IDX_faf9973b2fecb4b927f5e0ac9f" ON "zona" ("deleted_at") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_faf9973b2fecb4b927f5e0ac9f" ON "zona"');
    await queryRunner.query('DROP TABLE "zona"');
  }
}
