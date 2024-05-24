import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTipoEmergenciaTable1714343589769 implements MigrationInterface {
  name = 'CreateTipoEmergenciaTable1714343589769'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "tipo_emergencia" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "nome" varchar(50) NOT NULL, ' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "deleted_at" datetime ' +
      ')'
    );
    await queryRunner.query('CREATE INDEX "IDX_79afa0ffaf72f96ddd5aa4a1d4" ON "tipo_emergencia" ("deleted_at") ');

    await queryRunner.query(
      'CREATE TABLE "tipo_emergencia_x_grandeza" ( ' +
      '  "tipo_emergencia_id" integer NOT NULL, ' +
      '  "grandeza_id" integer NOT NULL, ' +

      '  CONSTRAINT "FK_773e08ef56c9caa3e56ccfc7eb1" FOREIGN KEY ("tipo_emergencia_id") REFERENCES "tipo_emergencia" ("id") ON DELETE CASCADE ON UPDATE CASCADE, ' +
      '  CONSTRAINT "FK_bf99c61622f2f9ea52ddf122b44" FOREIGN KEY ("grandeza_id") REFERENCES "grandeza" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, ' +
      '  PRIMARY KEY ("tipo_emergencia_id", "grandeza_id")' +
      ')'
    );
    await queryRunner.query('CREATE INDEX "IDX_773e08ef56c9caa3e56ccfc7eb" ON "tipo_emergencia_x_grandeza" ("tipo_emergencia_id") ');
    await queryRunner.query('CREATE INDEX "IDX_bf99c61622f2f9ea52ddf122b4" ON "tipo_emergencia_x_grandeza" ("grandeza_id") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query('ALTER TABLE "tipo_emergencia_x_grandeza" DROP FOREIGN KEY "FK_bf99c61622f2f9ea52ddf122b44"');
    // await queryRunner.query('ALTER TABLE "tipo_emergencia_x_grandeza" DROP FOREIGN KEY "FK_773e08ef56c9caa3e56ccfc7eb1"');
    await queryRunner.query('DROP INDEX "IDX_bf99c61622f2f9ea52ddf122b4" ON "tipo_emergencia_x_grandeza"');
    await queryRunner.query('DROP INDEX "IDX_773e08ef56c9caa3e56ccfc7eb" ON "tipo_emergencia_x_grandeza"');
    await queryRunner.query('DROP TABLE "tipo_emergencia_x_grandeza"');
    await queryRunner.query('DROP INDEX "IDX_79afa0ffaf72f96ddd5aa4a1d4" ON "tipo_emergencia"');

    await queryRunner.query('DROP TABLE "tipo_emergencia"');
  }
}
