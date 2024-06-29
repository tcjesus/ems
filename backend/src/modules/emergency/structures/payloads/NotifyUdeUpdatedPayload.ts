

import { DeteccaoEmergenciaModel } from '@/emergency/models/DeteccaoEmergenciaModel'
import { UdeModel } from '@/emergency/models/UdeModel'
import { TipoUdeEnum } from '@/emergency/structures/enum/TipoUdeEnum'
import { MathUtils } from '@/utils/MathUtils'
import normalizeStr from '@/utils/normalizeStr'

const INFINITY_16_BITS = 32767
const MIN_THRESHOLD_PLACEHOLDER = -INFINITY_16_BITS
const MAX_THRESHOLD_PLACEHOLDER = INFINITY_16_BITS
const SAMPLE_INTERVAL_PLACEHOLDER = 5

class SensorAtivoPayload {
  model: string
  variable: string
  sample_interval: number
  min_variation_rate: number
}

class MonitoramentosPayload {
  [key: string]: {
    min: number
    max: number
  }
}

class EmergenciasPayload {
  [key: string]: MonitoramentosPayload[]
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
    const sensoresMDC: { [key: string]: { values: number[], mdc: number } } = {}
    model.deteccoesEmergencia.forEach((deteccao) => {
      deteccao.monitoramentosGrandeza
        ?.filter(m => m.ativo)
        .forEach(monitoramento => {
          if (!sensoresMDC[monitoramento.sensorId]) {
            sensoresMDC[monitoramento.sensorId] = {
              values: [],
              mdc: 0
            }
          }
          sensoresMDC[monitoramento.sensorId].values.push(monitoramento.intervaloAmostragem)
        })
    })

    Object.values(sensoresMDC).forEach((v) => {
      v.mdc = MathUtils.gcd(v.values)
    })

    const sensoresAtivos = model.deteccoesEmergencia
      ?.reduce((result: SensorAtivoPayload[], deteccao: DeteccaoEmergenciaModel) => {
        deteccao.monitoramentosGrandeza
          ?.filter(m => m.ativo)
          // Remove duplicates by sensor id
          .filter((m1, index, self) => index === self.findIndex((m2) => (m1.sensorId === m2.sensorId && m1.grandezaId === m2.grandezaId)))
          .forEach(monitoramento => result.push({
            model: monitoramento.sensor!!.modelo,
            variable: normalizeStr(monitoramento.grandeza?.nome || 'grandeza'),
            sample_interval: sensoresMDC[monitoramento.sensorId]?.mdc || SAMPLE_INTERVAL_PLACEHOLDER,
            min_variation_rate: monitoramento.taxaVariacaoMinima,
          }))
        return result
      }, [] as SensorAtivoPayload[])

    const emergencias = model.deteccoesEmergencia
      ?.reduce((result: EmergenciasPayload, d: DeteccaoEmergenciaModel, dIndex: number) => {
        const monitoramentos = d.monitoramentosGrandeza
          ?.reduce((mAcc: MonitoramentosPayload, monitoramento, mIndex: number) => {
            let mKey = normalizeStr(monitoramento.grandeza?.nome) || `grandeza_${mIndex}`
            mAcc[mKey] = {
              min: monitoramento.thresholdMinimo || MIN_THRESHOLD_PLACEHOLDER,
              max: monitoramento.thresholdMaximo || MAX_THRESHOLD_PLACEHOLDER,
            }
            return mAcc
          }, {} as MonitoramentosPayload)

        let eKey = normalizeStr(d.tipoEmergencia?.nome) || `emergencia_${dIndex}`

        if (!result[eKey]) {
          result[eKey] = []
        }
        result[eKey].push(monitoramentos)

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
