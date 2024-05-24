import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDeteccaoEmergenciaTable1715747072351 implements MigrationInterface {
    name = 'CreateDeteccaoEmergenciaTable1715747072351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "monitoramento_grandeza" (' +
            '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
            '  "deteccao_emergencia_id" integer NOT NULL, ' +
            '  "sensor_id" integer NOT NULL, ' +
            '  "grandeza_id" integer NOT NULL, ' +
            '  "threshold_minimo" decimal(8,3), ' +
            '  "threshold_maximo" decimal(8,3), ' +
            '  "intervalo_amostragem" integer NOT NULL, ' +
            '  "taxa_variacao_minima" decimal(8,3) NOT NULL, ' +
            '  "ativo" boolean, ' +

            '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
            '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
            '  "deleted_at" datetime, ' +

            '  CONSTRAINT "FK_5907770892cb2bb624b1e415c5f" FOREIGN KEY ("deteccao_emergencia_id") REFERENCES "deteccao_emergencia" ("id") ON DELETE CASCADE ON UPDATE CASCADE, ' +
            '  CONSTRAINT "FK_5bfc0985da0c1e99d0374c5f216" FOREIGN KEY ("sensor_id") REFERENCES "sensor" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, ' +
            '  CONSTRAINT "FK_a6a2ddece5370432b36ba49388d" FOREIGN KEY ("grandeza_id") REFERENCES "grandeza" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION' +
            ')'
        );
        await queryRunner.query('CREATE INDEX "IDX_a18edfebc2e290faf3b037038b" ON "monitoramento_grandeza" ("deleted_at") ');

        await queryRunner.query(
            'CREATE TABLE "deteccao_emergencia" (' +
            '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
            '  "ude_id" integer NOT NULL, ' +
            '  "tipo_emergencia_id" integer NOT NULL, ' +
            '  "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
            '  "updated_at" datetime NOT NULL DEFAULT (datetime(\'now\')), ' +
            '  "deleted_at" datetime, ' +

            '  CONSTRAINT "FK_d38067f35adba07422588590e10" FOREIGN KEY ("ude_id") REFERENCES "ude" ("id") ON DELETE CASCADE ON UPDATE CASCADE, ' +
            '  CONSTRAINT "FK_72f567b651529f9200e92fa485b" FOREIGN KEY ("tipo_emergencia_id") REFERENCES "tipo_emergencia" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION' +
            ')'
        );
        await queryRunner.query('CREATE INDEX "IDX_48b06b65b89f84d89fa5662290" ON "deteccao_emergencia" ("deleted_at") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "deteccao_emergencia" DROP FOREIGN KEY "FK_72f567b651529f9200e92fa485b"');
        await queryRunner.query('ALTER TABLE "deteccao_emergencia" DROP FOREIGN KEY "FK_d38067f35adba07422588590e10"');
        await queryRunner.query('ALTER TABLE "monitoramento_grandeza" DROP FOREIGN KEY "FK_a6a2ddece5370432b36ba49388d"');
        await queryRunner.query('ALTER TABLE "monitoramento_grandeza" DROP FOREIGN KEY "FK_5bfc0985da0c1e99d0374c5f216"');
        await queryRunner.query('ALTER TABLE "monitoramento_grandeza" DROP FOREIGN KEY "FK_5907770892cb2bb624b1e415c5f"');
        await queryRunner.query('DROP INDEX "IDX_48b06b65b89f84d89fa5662290" ON "deteccao_emergencia"');
        await queryRunner.query('DROP TABLE "deteccao_emergencia"');
        await queryRunner.query('DROP INDEX "IDX_a18edfebc2e290faf3b037038b" ON "monitoramento_grandeza"');
        await queryRunner.query('DROP TABLE "monitoramento_grandeza"');
    }
}
