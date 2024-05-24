import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGrandezaTable1714343578291 implements MigrationInterface {
  name = 'CreateGrandezaTable1714343578291'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `grandeza` (' +
      '  `id` int NOT NULL AUTO_INCREMENT, ' +
      '  `nome` varchar(50) NOT NULL, ' +
      '  `unidade_medida` varchar(50) NULL, ' +
      '  `sigla` varchar(20) NULL, ' +

      '  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
      '  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), ' +
      '  `deleted_at` datetime(6) NULL, ' +

      '  INDEX `IDX_54410094f950b7c8fb01e182d8` (`deleted_at`), ' +
      '  PRIMARY KEY (`id`)' +
      ') ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_54410094f950b7c8fb01e182d8` ON `grandeza`');
    await queryRunner.query('DROP TABLE `grandeza`');
  }
}
