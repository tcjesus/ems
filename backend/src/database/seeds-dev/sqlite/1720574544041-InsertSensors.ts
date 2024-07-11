import { MigrationInterface, QueryRunner } from "typeorm";


/*
'CREATE TABLE "sensor" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "modelo" varchar(50) NOT NULL, ' +
      '  "descricao" varchar(255), ' +
*/

/*
'CREATE TABLE "especificacao_grandeza" (' +
      '  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
      '  "sensor_id" integer NOT NULL, ' +
      '  "grandeza_id" integer NOT NULL, ' +
      '  "valor_minimo" decimal(8,3), ' +
      '  "valor_maximo" decimal(8,3), ' +
      '  "sinal" varchar(15), ' +
*/
const sensors = [
  {
    modelo: 'Generic MD-0123',
    descricao: 'Generic temperature sensor',
    especificacoes: [
      { grandeza: 'Temperature', valorMinimo: 0, valorMaximo: 100, sinal: 'DIGITAL' },
    ],
  },
  {
    modelo: 'Generic MD-4567',
    descricao: 'Generic smoke sensor',
    especificacoes: [
      { grandeza: 'Smoke', valorMinimo: 0, valorMaximo: 50, sinal: 'DIGITAL' },
    ],
  },
  {
    modelo: 'Generic MD-6789',
    descricao: 'Generic gas sensor',
    especificacoes: [
      { grandeza: 'Gas', valorMinimo: 0, valorMaximo: 200, sinal: 'DIGITAL' },
    ],
  },
  {
    modelo: 'Generic MD-9876',
    descricao: 'Generic humidity sensor',
    especificacoes: [
      { grandeza: 'Humidity', valorMinimo: 0, valorMaximo: 100, sinal: 'ANALOGICO' },
    ],
  },
  {
    modelo: 'Generic MD-4321',
    descricao: 'Generic pression sensor',
    especificacoes: [
      { grandeza: 'Pression', valorMinimo: 0, valorMaximo: 10, sinal: 'DIGITAL' },
    ],
  },
  {
    modelo: 'Generic MD-3241',
    descricao: 'Generic temperature and pression sensor',
    especificacoes: [
      { grandeza: 'Temperature', valorMinimo: 0, valorMaximo: 100, sinal: 'DIGITAL' },
      { grandeza: 'Pression', valorMinimo: 0, valorMaximo: 10, sinal: 'DIGITAL' },
    ],
  },
  {
    modelo: 'Generic MD-5432',
    descricao: 'Generic temperature and humidity sensor',
    especificacoes: [
      { grandeza: 'Temperature', valorMinimo: 0, valorMaximo: 100, sinal: 'DIGITAL' },
      { grandeza: 'Humidity', valorMinimo: 0, valorMaximo: 100, sinal: 'ANALOGICO' },
    ],
  },
]

export class InsertSensors1720574544041 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const sensor of sensors) {
      const grandezas = await queryRunner.manager.query(
        `SELECT * FROM grandeza WHERE nome IN (${sensor.especificacoes.map(() => '?').join(',')})`,
        sensor.especificacoes.map((especificacao) => especificacao.grandeza),
      )

      if (grandezas.length !== sensor.especificacoes.length) {
        throw new Error(`Grandezas do tipo de emergência '${sensor.modelo}' não encontradas`)
      }

      await queryRunner.manager.query(
        `INSERT INTO sensor (modelo, descricao) VALUES (?, ?)`,
        [sensor.modelo, sensor.descricao],
      )

      const sensorId = await queryRunner.manager.query(
        `SELECT id FROM sensor WHERE modelo = ?`,
        [sensor.modelo],
      )

      for (const especificacao of sensor.especificacoes) {
        const grandeza = grandezas.find((grandeza) => grandeza.nome === especificacao.grandeza)
        await queryRunner.manager.query(
          `INSERT INTO especificacao_grandeza (sensor_id, grandeza_id, valor_minimo, valor_maximo, sinal) VALUES (?, ?, ?, ?, ?)`,
          [sensorId[0].id, grandeza.id, especificacao.valorMinimo, especificacao.valorMaximo, especificacao.sinal],
        )
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sensorIds = await queryRunner.manager.query(
      `SELECT id FROM sensor WHERE modelo IN (${sensors.map(() => '?').join(',')})`,
      sensors.map((sensor) => sensor.modelo),
    )

    queryRunner.manager.query(
      `DELETE FROM sensor WHERE modelo IN (${sensors.map(() => '?').join(',')})`,
      sensors.map((sensor) => sensor.modelo),
    )

    queryRunner.manager.query(
      `DELETE FROM especificacao_grandeza WHERE sensor_id IN (${sensorIds.map(() => '?').join(',')})`,
      sensorIds.map((sensorId) => sensorId.id),
    )
  }
}
