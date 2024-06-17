import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCidadeTable1718626278401 implements MigrationInterface {
    name = 'CreateCidadeTable1718626278401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `estado` (' +
            '  `id` int NOT NULL AUTO_INCREMENT, ' +
            '  `nome` varchar(50) NOT NULL, `sigla` varchar(2) NOT NULL, ' +

            '  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
            '  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), ' +
            '  `deleted_at` datetime(6) NULL, ' +

            '  INDEX `IDX_2437136778b4046ef8ae97f56a` (`deleted_at`), ' +
            '  PRIMARY KEY (`id`)' +
            ') ENGINE=InnoDB'
        );

        await queryRunner.query(
            'CREATE TABLE `cidade` (' +
            '  `id` int NOT NULL AUTO_INCREMENT, ' +
            '  `codigo_ibge` varchar(15) NOT NULL, ' +
            '  `nome` varchar(50) NOT NULL, ' +
            '  `estado_id` integer NOT NULL,' +

            '  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
            '  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), ' +
            '  `deleted_at` datetime(6) NULL, ' +

            '  INDEX `IDX_4262539bb6ef5b560e79be63ac` (`deleted_at`), ' +
            '  PRIMARY KEY (`id`)' +
            ') ENGINE=InnoDB'
        );
        await queryRunner.query('ALTER TABLE `cidade` ADD CONSTRAINT `FK_838dba2bb71b4f93e237f1460bd` FOREIGN KEY (`estado_id`) REFERENCES `estado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `cidade` DROP FOREIGN KEY `FK_838dba2bb71b4f93e237f1460bd`');
        await queryRunner.query('DROP INDEX `IDX_4262539bb6ef5b560e79be63ac`');
        await queryRunner.query('DROP TABLE `cidade`');
        await queryRunner.query('DROP INDEX `IDX_2437136778b4046ef8ae97f56a`');
        await queryRunner.query('DROP TABLE `estado`');
    }
}
