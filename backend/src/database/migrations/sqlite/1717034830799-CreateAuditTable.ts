import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditTable1717034830799 implements MigrationInterface {
    name = 'CreateAuditTable1717034830799'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
            '  "deleted_at" datetime, ' +

            '  CONSTRAINT "FK_cde549be854d1ea402aab6ac76f" FOREIGN KEY ("account_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION' +
            ')'
        );
        await queryRunner.query('CREATE INDEX "IDX_1067323d0494dd14952a0d8b72" ON "audit" ("deleted_at") ');
        await queryRunner.query('CREATE INDEX "IDX_audit_account" ON "audit" ("account_id") ');
        await queryRunner.query('CREATE INDEX "IDX_audit_method" ON "audit" ("method") ');
        await queryRunner.query('CREATE INDEX "IDX_audit_resource" ON "audit" ("resource") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "IDX_audit_resource"');
        await queryRunner.query('DROP INDEX "IDX_audit_method"');
        await queryRunner.query('DROP INDEX "IDX_audit_account"');
        await queryRunner.query('DROP INDEX "IDX_1067323d0494dd14952a0d8b72"');
        await queryRunner.query('DROP TABLE "audit"');
    }
}
