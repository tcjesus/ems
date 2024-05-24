import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDeteccaoEmergenciaTable1715747072351 implements MigrationInterface {
    name = 'CreateDeteccaoEmergenciaTable1715747072351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `monitoramento_grandeza` (' +
            '  `id` int NOT NULL AUTO_INCREMENT, ' +
            '  `deteccao_emergencia_id` int NOT NULL, ' +
            '  `sensor_id` int NOT NULL, ' +
            '  `grandeza_id` int NOT NULL, ' +
            '  `threshold_minimo` decimal(8,3) NULL, ' +
            '  `threshold_maximo` decimal(8,3) NULL, ' +
            '  `intervalo_amostragem` int NOT NULL, ' +
            '  `taxa_variacao_minima` decimal(8,3) NOT NULL, ' +
            '  `ativo` tinyint NULL, ' +

            '  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
            '  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), ' +
            '  `deleted_at` datetime(6) NULL, ' +

            '  INDEX `IDX_a18edfebc2e290faf3b037038b` (`deleted_at`),' +
            '  PRIMARY KEY (`id`)' +
            ') ENGINE=InnoDB'
        );
        await queryRunner.query(
            'CREATE TABLE `deteccao_emergencia` (' +
            '  `id` int NOT NULL AUTO_INCREMENT, ' +
            '  `ude_id` int NOT NULL, ' +
            '  `tipo_emergencia_id` int NOT NULL, ' +
            '  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
            '  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), ' +
            '  `deleted_at` datetime(6) NULL, ' +

            '  INDEX `IDX_48b06b65b89f84d89fa5662290` (`deleted_at`), ' +
            '  PRIMARY KEY (`id`)' +
            ')ENGINE=InnoDB'
        );
        await queryRunner.query('ALTER TABLE `monitoramento_grandeza` ADD CONSTRAINT `FK_5907770892cb2bb624b1e415c5f` FOREIGN KEY (`deteccao_emergencia_id`) REFERENCES `deteccao_emergencia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE `monitoramento_grandeza` ADD CONSTRAINT `FK_5bfc0985da0c1e99d0374c5f216` FOREIGN KEY (`sensor_id`) REFERENCES `sensor`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `monitoramento_grandeza` ADD CONSTRAINT `FK_a6a2ddece5370432b36ba49388d` FOREIGN KEY (`grandeza_id`) REFERENCES `grandeza`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `deteccao_emergencia` ADD CONSTRAINT `FK_d38067f35adba07422588590e10` FOREIGN KEY (`ude_id`) REFERENCES `ude`(`id`) ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE `deteccao_emergencia` ADD CONSTRAINT `FK_72f567b651529f9200e92fa485b` FOREIGN KEY (`tipo_emergencia_id`) REFERENCES `tipo_emergencia`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `deteccao_emergencia` DROP FOREIGN KEY `FK_72f567b651529f9200e92fa485b`');
        await queryRunner.query('ALTER TABLE `deteccao_emergencia` DROP FOREIGN KEY `FK_d38067f35adba07422588590e10`');
        await queryRunner.query('ALTER TABLE `monitoramento_grandeza` DROP FOREIGN KEY `FK_a6a2ddece5370432b36ba49388d`');
        await queryRunner.query('ALTER TABLE `monitoramento_grandeza` DROP FOREIGN KEY `FK_5bfc0985da0c1e99d0374c5f216`');
        await queryRunner.query('ALTER TABLE `monitoramento_grandeza` DROP FOREIGN KEY `FK_5907770892cb2bb624b1e415c5f`');
        await queryRunner.query('DROP INDEX `IDX_48b06b65b89f84d89fa5662290` ON `deteccao_emergencia`');
        await queryRunner.query('DROP TABLE `deteccao_emergencia`');
        await queryRunner.query('DROP INDEX `IDX_a18edfebc2e290faf3b037038b` ON `monitoramento_grandeza`');
        await queryRunner.query('DROP TABLE `monitoramento_grandeza`');
    }
}
