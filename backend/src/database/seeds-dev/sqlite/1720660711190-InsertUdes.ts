import { MigrationInterface, QueryRunner } from "typeorm";

import { CidadeModel } from "@/locality/models/CidadeModel";
import { LocalidadeModel } from "@/locality/models/LocalidadeModel";
import { SensorModel } from "@/emergency/models/SensorModel";
import { DeteccaoEmergenciaModel } from "@/emergency/models/DeteccaoEmergenciaModel";
import { TipoEmergenciaModel } from "@/emergency/models/TipoEmergenciaModel";
import { UdeModel } from "@/emergency/models/UdeModel";
import { TipoUdeEnum } from "@/emergency/structures/enum/TipoUdeEnum";
import { MonitoramentoGrandezaModel } from "@/emergency/models/MonitoramentoGrandezaModel";
import { GrandezaModel } from "@/emergency/models/GrandezaModel";
import { ZonaModel } from "@/emergency/models/ZonaModel";

const udes = [
  {
    tipo: 'APC',
    label: 'My HPC Device',
    mac: '00:00:00:00:00:00',
    latitude: -12.2004383,
    longitude: -38.9719222,
    operatingRange: 50,
    zona: 'Zone 1 (UEFS)',
    localidade: 'Feira de Santana',
    deteccoesEmergencia: [
      {
        tipoEmergencia: 'Fire',
        monitoramentosGrandeza: [
          {
            sensor: 'Generic MD-0123',
            grandeza: 'Temperature',
            thresholdMinimo: 0,
            thresholdMaximo: 100,
            intervaloAmostragem: 5,
            taxaVariacaoMinima: 0.1,
            ativo: true,
          },
          {
            sensor: 'Generic MD-5432',
            grandeza: 'Humidity',
            thresholdMinimo: 0,
            thresholdMaximo: 100,
            intervaloAmostragem: 5,
            taxaVariacaoMinima: 0.1,
          },
        ]
      }
    ]
  },
]

export class InsertUdes1720660711190 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const ude of udes) {
      const cidade = await queryRunner.manager.findOne(CidadeModel, { where: { nome: ude.localidade } })
      if (!cidade) {
        throw new Error(`Cidade '${ude.localidade}' não encontrada`)
      }

      const localidade = await queryRunner.manager.findOne(LocalidadeModel, { where: { cidadeId: cidade.id } })
      if (!localidade) {
        throw new Error(`Localidade '${ude.localidade}' não encontrada`)
      }

      const zona = await queryRunner.manager.findOne(ZonaModel, { where: { nome: ude.zona } })
      if (!zona) {
        throw new Error(`Zona '${ude.zona}' não encontrada`)
      }

      const udeModel = new UdeModel({
        tipo: TipoUdeEnum[ude.tipo],
        label: ude.label,
        mac: ude.mac,
        zona: zona,
        latitude: ude.latitude,
        longitude: ude.longitude,
        operatingRange: ude.operatingRange,
        localidadeId: localidade.id,
      })

      const deteccoesEmergencia: DeteccaoEmergenciaModel[] = []
      for (const deteccao of ude.deteccoesEmergencia) {
        const tipoEmergencia = await queryRunner.manager.findOne(TipoEmergenciaModel, { where: { nome: deteccao.tipoEmergencia } })
        if (!tipoEmergencia) {
          throw new Error(`Tipo de emergência '${deteccao.tipoEmergencia}' não encontrado`)
        }

        const deteccaoEmergencia = new DeteccaoEmergenciaModel({
          udeId: udeModel.id,
          tipoEmergenciaId: tipoEmergencia.id,
        })

        const monitoramentosGrandeza: MonitoramentoGrandezaModel[] = []
        for (const monitoramento of deteccao.monitoramentosGrandeza) {
          const sensor = await queryRunner.manager.findOne(SensorModel, { where: { modelo: monitoramento.sensor } })
          if (!sensor) {
            throw new Error(`Sensor '${monitoramento.sensor}' não encontrado`)
          }

          const grandeza = await queryRunner.manager.findOne(GrandezaModel, { where: { nome: monitoramento.grandeza } })
          if (!grandeza) {
            throw new Error(`Grandeza '${monitoramento.grandeza}' não encontrada`)
          }

          const monitoramentoGrandeza = new MonitoramentoGrandezaModel({
            deteccaoEmergenciaId: deteccaoEmergencia.id,
            sensorId: sensor.id,
            grandeza: grandeza,
            thresholdMinimo: monitoramento.thresholdMinimo,
            thresholdMaximo: monitoramento.thresholdMaximo,
            intervaloAmostragem: monitoramento.intervaloAmostragem,
            taxaVariacaoMinima: monitoramento.taxaVariacaoMinima,
            ativo: monitoramento.ativo,
          })

          monitoramentosGrandeza.push(monitoramentoGrandeza)
        }

        deteccaoEmergencia.monitoramentosGrandeza = monitoramentosGrandeza
        deteccoesEmergencia.push(deteccaoEmergencia)
      }

      udeModel.deteccoesEmergencia = deteccoesEmergencia
      await queryRunner.manager.save(UdeModel, udeModel)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(UdeModel, { tipo: udes[0].tipo })
  }
}
