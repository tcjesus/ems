import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSensorTable1714655309252 implements MigrationInterface {
  name = 'CreateSensorTable1714655309252'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "sensor" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "modelo" varchar(50) NOT NULL, ' +
      '  "descricao" varchar(255), ' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "deleted_at" datetime ' +
      ')'
    );
    await queryRunner.query('CREATE INDEX "IDX_bdca0a2895b53008dea8657ac8" ON "sensor" ("deleted_at") ');

    await queryRunner.query(
      'CREATE TABLE "especificacao_grandeza" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "sensor_id" integer NOT NULL, ' +
      '  "grandeza_id" integer NOT NULL, ' +
      '  "valor_minimo" decimal(8,3), ' +
      '  "valor_maximo" decimal(8,3), ' +
      '  "sinal" varchar(15), ' +

      '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
      '  "deleted_at" datetime,' +

      '  CONSTRAINT "FK_e61d23b87f73a985ff054e8aa5d" FOREIGN KEY ("sensor_id") REFERENCES "sensor" ("id") ON DELETE CASCADE ON UPDATE CASCADE, ' +
      '  CONSTRAINT "FK_dc3e717bb039ad1e350ec3305a6" FOREIGN KEY ("grandeza_id") REFERENCES "grandeza" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION' +
      ')'
    );
    await queryRunner.query('CREATE INDEX "IDX_c7a90a9d09acad8246f7e17f34" ON "especificacao_grandeza" ("deleted_at") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query('ALTER TABLE "especificacao_grandeza" DROP FOREIGN KEY "FK_dc3e717bb039ad1e350ec3305a6"');
    // await queryRunner.query('ALTER TABLE "especificacao_grandeza" DROP FOREIGN KEY "FK_e61d23b87f73a985ff054e8aa5d"');
    await queryRunner.query('DROP INDEX "IDX_c7a90a9d09acad8246f7e17f34" ON "especificacao_grandeza"');
    await queryRunner.query('DROP TABLE "especificacao_grandeza"');

    await queryRunner.query('DROP INDEX "IDX_bdca0a2895b53008dea8657ac8" ON "sensor"');
    await queryRunner.query('DROP TABLE "sensor"');
  }
}
