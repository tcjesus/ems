import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateZonaTable1714738381591 implements MigrationInterface {
  name = 'CreateZonaTable1714738381591'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `zona` (' +
      '  `id` int NOT NULL AUTO_INCREMENT, ' +
      '  `nome` varchar(50) NOT NULL, ' +

      '  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
      '  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), ' +
      '  `deleted_at` datetime(6) NULL, ' +

      '  INDEX `IDX_faf9973b2fecb4b927f5e0ac9f` (`deleted_at`), ' +
      '  PRIMARY KEY (`id`)' +
      ') ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_faf9973b2fecb4b927f5e0ac9f` ON `zona`');
    await queryRunner.query('DROP TABLE `zona`');
  }
}
