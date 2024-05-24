import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRegistroMonitoramentoTables1716523573120 implements MigrationInterface {
    name = 'CreateRegistroMonitoramentoTables1716523573120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `registro_monitoramento_bruto` (' +
            '  `id` int NOT NULL AUTO_INCREMENT, ' +
            '  `ude_id` int NOT NULL, ' +
            '  `sensor` varchar NOT NULL, ' +
            '  `grandeza` varchar NOT NULL, ' +
            '  `valor` decimal(8,3) NOT NULL, ' +
            '  `data_inicial` datetime NOT NULL, ' +
            '  `data_final` datetime NOT NULL,' +

            '  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
            '  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), ' +
            '  `deleted_at` datetime(6) NULL, ' +

            '  INDEX `IDX_a8e3451f8a3f494203b5013b61` (`deleted_at`),' +
            '  PRIMARY KEY (`id`)' +
            ') ENGINE=InnoDB'
        );

        await queryRunner.query(
            'CREATE TABLE `registro_monitoramento` (' +
            '  `id` int NOT NULL AUTO_INCREMENT, ' +
            '  `registro_bruto_id` int NOT NULL, ' +
            '  `ude_id` int NOT NULL, ' +
            '  `sensor_id` int NOT NULL, ' +
            '  `grandeza_id` int NOT NULL, ' +
            '  `valor` decimal(8,3) NOT NULL, ' +
            '  `data_coleta` datetime NOT NULL,' +

            '  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
            '  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), ' +
            '  `deleted_at` datetime(6) NULL, ' +

            '  INDEX `IDX_fb0dde7b7412071c72854328b0` (`deleted_at`),' +
            '  PRIMARY KEY (`id`)' +
            ') ENGINE=InnoDB'
        );
        await queryRunner.query('ALTER TABLE `registro_monitoramento` ADD CONSTRAINT `FK_5f863808d7b1f065b8596773a90` FOREIGN KEY (`registro_bruto_id`) REFERENCES `registro_monitoramento_bruto`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `registro_monitoramento` ADD CONSTRAINT `FK_72ef93beb50088aa1c53357a9b4` FOREIGN KEY (`ude_id`) REFERENCES `ude`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `registro_monitoramento` ADD CONSTRAINT `FK_d48f7fa14348be549f20d1b8a6d` FOREIGN KEY (`sensor_id`) REFERENCES `sensor`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `registro_monitoramento` ADD CONSTRAINT `FK_3378dff7e5a7dbc0fb70a964b56` FOREIGN KEY (`grandeza_id`) REFERENCES `grandeza`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `registro_monitoramento` DROP FOREIGN KEY `FK_3378dff7e5a7dbc0fb70a964b56`');
        await queryRunner.query('ALTER TABLE `registro_monitoramento` DROP FOREIGN KEY `FK_d48f7fa14348be549f20d1b8a6d`');
        await queryRunner.query('ALTER TABLE `registro_monitoramento` DROP FOREIGN KEY `FK_72ef93beb50088aa1c53357a9b4`');
        await queryRunner.query('ALTER TABLE `registro_monitoramento` DROP FOREIGN KEY `FK_5f863808d7b1f065b8596773a90`');
        await queryRunner.query('DROP INDEX `IDX_fb0dde7b7412071c72854328b0` ON `registro_monitoramento`');
        await queryRunner.query('DROP TABLE `registro_monitoramento`');
        await queryRunner.query('DROP INDEX `IDX_a8e3451f8a3f494203b5013b61` ON `registro_monitoramento_bruto`');
        await queryRunner.query('DROP TABLE `registro_monitoramento_bruto`');
    }

}
