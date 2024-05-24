

import { DeteccaoEmergenciaModel } from '@/emergency/models/DeteccaoEmergenciaModel'
import { UdeModel } from '@/emergency/models/UdeModel'
import { TipoUdeEnum } from '@/emergency/structures/enum/TipoUdeEnum'

class SensorAtivoPayload {
  model: string
  variable: string
}

class EmergenciaPayload {
  [key: string]: {
    min_threshold: number | null
    max_threshold: number | null
    sample_interval: number | null
    min_variation_rate: number
  }
}

class EmergenciasPayload {
  [key: string]: EmergenciaPayload
}

export class NotifyUdeUpdatedPayload {
  id: number
  type: TipoUdeEnum
  mac: string
  latitude: number
  longitude: number
  zone: number
  active_sensors: SensorAtivoPayload[]
  emergencies: EmergenciasPayload

  static parse(model: UdeModel): NotifyUdeUpdatedPayload {
    const sensoresAtivos = model.deteccoesEmergencia
      ?.reduce((result: any, deteccao: DeteccaoEmergenciaModel) => {
        deteccao.monitoramentosGrandeza
          ?.filter(m => m.ativo)
          // Remove duplicates by sensor id
          .filter((m1, index, self) => index === self.findIndex((m2) => (m1.sensorId === m2.sensorId && m1.grandezaId === m2.grandezaId)))
          .forEach(monitoramento => result.push({
            modelo: monitoramento.sensor!!.modelo,
            grandeza: (monitoramento.grandeza?.nome.toLowerCase() || 'grandeza')
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          }))
        return result
      }, [] as SensorAtivoPayload[])

    const emergencias = model.deteccoesEmergencia
      ?.reduce((result: any, d: DeteccaoEmergenciaModel, dIndex: number) => {
        const grandezas = d.monitoramentosGrandeza
          ?.reduce((mAcc: any, monitoramento, mIndex: number) => {
            let mKey = monitoramento.grandeza?.nome.toLowerCase() || `grandeza_${mIndex}`
            mKey = mKey.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            mAcc[mKey] = {
              min_threshold: monitoramento.thresholdMinimo || null,
              max_threshold: monitoramento.thresholdMaximo || null,
              sample_interval: monitoramento.intervaloAmostragem,
              min_variation_rate: monitoramento.taxaVariacaoMinima,
            }
            return mAcc
          }, {} as EmergenciaPayload)

        let eKey = d.tipoEmergencia?.nome.toLowerCase() || `emergencia_${dIndex}`
        eKey = eKey.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

        if (!result[eKey]) {
          result[eKey] = []
        }
        result[eKey].push(grandezas)

        return result
      }, {} as EmergenciasPayload)

    return {
      id: model.id,
      type: model.tipo,
      mac: model.mac,
      latitude: model.latitude,
      longitude: model.longitude,
      zone: model.zona!.id,
      active_sensors: sensoresAtivos,
      emergencies: emergencias,
    }
  }
}
