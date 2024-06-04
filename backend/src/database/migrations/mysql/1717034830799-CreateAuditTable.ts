import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditTable1717034830799 implements MigrationInterface {
    name = 'CreateAuditTable1717034830799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `audit` (' +
            '  `id` varchar PRIMARY KEY NOT NULL, ' +
            '  `account_id` int NOT NULL, ' +
            '  `method` varchar(6) NOT NULL, ' +
            '  `resource` varchar(100) NOT NULL, ' +
            '  "query" text, ' +
            '  "params" text, ' +
            '  "request" text, ' +
            '  "old_record" text, ' +
            '  "response" text, ' +

            '  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
            '  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), ' +
            '  `deleted_at` datetime(6) NULL, ' +

            '  INDEX `IDX_1067323d0494dd14952a0d8b72` (`deleted_at`), ' +
            '  INDEX `IDX_audit_account` (`account_id`), ' +
            '  INDEX `IDX_audit_method` (`method`), ' +
            '  INDEX `IDX_audit_resource` (`resource`), ' +

            '  PRIMARY KEY (`id`)' +
            ') ENGINE=InnoDB'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX `IDX_audit_resource` ON `audit`');
        await queryRunner.query('DROP INDEX `IDX_audit_method` ON `audit`');
        await queryRunner.query('DROP INDEX `IDX_audit_account` ON `audit`');
        await queryRunner.query('DROP INDEX `IDX_1067323d0494dd14952a0d8b72` ON `audit`');
        await queryRunner.query('DROP TABLE `audit`');
    }
}
