import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountTable1714343577159 implements MigrationInterface {
  name = 'CreateAccountTable1714343577159'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `account` (' +
      '  `id` int NOT NULL AUTO_INCREMENT,' +
      '  `nome` varchar(100) NULL,' +
      '  `email` varchar(100) NULL,' +
      '  `password` varchar(255) NULL,' +
      '  `role` varchar(15) NULL,' +

      '  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),' +
      '  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),' +
      '  `deleted_at` datetime(6) NULL,' +

      '  UNIQUE INDEX `IDX_account_email` (`email`),' +
      '  INDEX `IDX_10389424cb6dac9dc4e8ee91c4` (`deleted_at`),' +
      '  PRIMARY KEY (`id`)' +
      ') ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_account_email` ON `account`');
    await queryRunner.query('DROP INDEX `IDX_10389424cb6dac9dc4e8ee91c4` ON `account`');
    await queryRunner.query('DROP TABLE `account`');
  }
}
