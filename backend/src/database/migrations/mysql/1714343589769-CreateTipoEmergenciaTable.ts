import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTipoEmergenciaTable1714343589769 implements MigrationInterface {
  name = 'CreateTipoEmergenciaTable1714343589769'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `tipo_emergencia` (' +
      '  `id` int NOT NULL AUTO_INCREMENT, ' +
      '  `nome` varchar(50) NOT NULL, ' +

      '  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
      '  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), ' +
      '  `deleted_at` datetime(6) NULL, ' +

      '  INDEX `IDX_79afa0ffaf72f96ddd5aa4a1d4` (`deleted_at`), ' +
      '  PRIMARY KEY (`id`)' +
      ') ENGINE=InnoDB'
    );

    await queryRunner.query(
      'CREATE TABLE `tipo_emergencia_x_grandeza` ( ' +
      '  `tipo_emergencia_id` int NOT NULL, ' +
      '  `grandeza_id` int NOT NULL, ' +

      '  INDEX `IDX_773e08ef56c9caa3e56ccfc7eb` (`tipo_emergencia_id`), ' +
      '  INDEX `IDX_bf99c61622f2f9ea52ddf122b4` (`grandeza_id`), ' +
      '  PRIMARY KEY (`tipo_emergencia_id`, `grandeza_id`) ' +
      ') ENGINE=InnoDB'
    );
    await queryRunner.query('ALTER TABLE `tipo_emergencia_x_grandeza` ADD CONSTRAINT `FK_773e08ef56c9caa3e56ccfc7eb1` FOREIGN KEY (`tipo_emergencia_id`) REFERENCES `tipo_emergencia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE `tipo_emergencia_x_grandeza` ADD CONSTRAINT `FK_bf99c61622f2f9ea52ddf122b44` FOREIGN KEY (`grandeza_id`) REFERENCES `grandeza`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `tipo_emergencia_x_grandeza` DROP FOREIGN KEY `FK_bf99c61622f2f9ea52ddf122b44`');
    await queryRunner.query('ALTER TABLE `tipo_emergencia_x_grandeza` DROP FOREIGN KEY `FK_773e08ef56c9caa3e56ccfc7eb1`');
    await queryRunner.query('DROP INDEX `IDX_bf99c61622f2f9ea52ddf122b4` ON `tipo_emergencia_x_grandeza`');
    await queryRunner.query('DROP INDEX `IDX_773e08ef56c9caa3e56ccfc7eb` ON `tipo_emergencia_x_grandeza`');
    await queryRunner.query('DROP TABLE `tipo_emergencia_x_grandeza`');
    await queryRunner.query('DROP INDEX `IDX_79afa0ffaf72f96ddd5aa4a1d4` ON `tipo_emergencia`');

    await queryRunner.query('DROP TABLE `tipo_emergencia`');
  }
}
