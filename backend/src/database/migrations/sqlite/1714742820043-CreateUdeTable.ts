import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUdeTable1714742820043 implements MigrationInterface {
  name = 'CreateUdeTable1714742820043'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "ude" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "tipo" varchar(5) NOT NULL, ' +
      '  "label" varchar(50) NOT NULL, ' +
      '  "mac" varchar(17) NOT NULL, ' +
      '  "latitude" decimal(10,7) NOT NULL, ' +
      '  "longitude" decimal(10,7) NOT NULL, ' +
      '  "operating_range" decimal(8,2), ' +
      '  "zona_id" integer NOT NULL, ' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "deleted_at" datetime, ' +

      '  CONSTRAINT "FK_dcfe97e2ec3c8e44049421d448b" FOREIGN KEY ("zona_id") REFERENCES "zona" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION' +
      ')'
    );
    await queryRunner.query('CREATE INDEX "IDX_b65f2fd9b2430f508243533fb1" ON "ude" ("deleted_at") ');
    await queryRunner.query('CREATE INDEX "IDX_d7a5846f9e539a919d81d1c845" ON "ude" ("mac") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "ude" DROP FOREIGN KEY "FK_dcfe97e2ec3c8e44049421d448b"');
    await queryRunner.query('DROP INDEX "IDX_d7a5846f9e539a919d81d1c845" ON "ude"');
    await queryRunner.query('DROP INDEX "IDX_b65f2fd9b2430f508243533fb1" ON "ude"');
    await queryRunner.query('DROP TABLE "ude"');
  }
}
