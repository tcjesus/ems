import { MigrationInterface, QueryRunner } from "typeorm";

const grandezas: { nome: string; unidadeMedida: string; sigla: string }[] = [
  {
    nome: 'Temperatura',
    unidadeMedida: 'Celsius',
    sigla: '°C',
  },
  {
    nome: 'Pressão',
    unidadeMedida: 'Atmosfera',
    sigla: 'atm',
  },
  {
    nome: 'Umidade',
    unidadeMedida: 'Porcentagem',
    sigla: '%',
  },
  {
    nome: 'Luminosidade',
    unidadeMedida: 'Lux',
    sigla: 'lx',
  },
  {
    nome: 'Fumaça',
    unidadeMedida: 'Partículas por milhão',
    sigla: 'ppm',
  },
  {
    nome: 'Gás',
    unidadeMedida: 'Partículas por milhão',
    sigla: 'ppm',
  }
]

export class InsertGrandezas1714345414162 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const grandeza of grandezas) {
      await queryRunner.manager.query(
        `INSERT INTO grandeza (nome, unidade_medida, sigla) VALUES (?, ?, ?)`,
        [grandeza.nome, grandeza.unidadeMedida, grandeza.sigla],
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const nomes = grandezas.map((grandeza) => grandeza.nome)
    queryRunner.manager.query(
      `DELETE FROM grandeza WHERE nome IN (${nomes.map(() => '?').join(',')})`,
      nomes,
    )
  }
}
