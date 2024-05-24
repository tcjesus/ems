import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUdeTable1714742820043 implements MigrationInterface {
  name = 'CreateUdeTable1714742820043'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `ude` (' +
      '  `id` int NOT NULL AUTO_INCREMENT, ' +
      '  `tipo` varchar(5) NOT NULL, ' +
      '  `label` varchar(50) NOT NULL, ' +
      '  `mac` varchar(17) NOT NULL, ' +
      '  `latitude` decimal(10,7) NOT NULL, ' +
      '  `longitude` decimal(10,7) NOT NULL, ' +
      '  `operating_range` decimal(8,2) NULL, ' +
      '  `zona_id` int NOT NULL, ' +

      '  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
      '  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), ' +
      '  `deleted_at` datetime(6) NULL, ' +

      '  INDEX `IDX_d7a5846f9e539a919d81d1c845` (`mac`), ' +
      '  INDEX `IDX_b65f2fd9b2430f508243533fb1` (`deleted_at`), ' +
      '  PRIMARY KEY (`id`)' +
      ') ENGINE=InnoDB'
    );
    await queryRunner.query('ALTER TABLE `ude` ADD CONSTRAINT `FK_dcfe97e2ec3c8e44049421d448b` FOREIGN KEY (`zona_id`) REFERENCES `zona`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `ude` DROP FOREIGN KEY `FK_dcfe97e2ec3c8e44049421d448b`');
    await queryRunner.query('DROP INDEX `IDX_d7a5846f9e539a919d81d1c845` ON `ude`');
    await queryRunner.query('DROP INDEX `IDX_b65f2fd9b2430f508243533fb1` ON `ude`');
    await queryRunner.query('DROP TABLE `ude`');
  }
}
