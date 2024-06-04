import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber } from 'class-validator'

import { MonitoramentoRawDataModel } from '@/emergency/models/MonitoramentoRawDataModel'
import { GrandezaResponse } from '@/emergency/structures/responses/GrandezaResponse'
import { SensorResponse } from '@/emergency/structures/responses/SensorResponse'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'
import normalizeStr from '@/utils/normalizeStr'

export class MonitoramentoRawDataResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador da Grandeza', example: 1 })
  id: number

  @IsDefined()
  @ApiProperty({ description: 'Ude que originiou o registro', type: UdeResponse })
  ude: UdeResponse

  @IsDefined()
  @ApiProperty({ description: 'Sensor que originou o registro', type: SensorResponse })
  sensor: SensorResponse

  @IsDefined()
  @ApiProperty({ description: 'Grandeza monitorada', type: GrandezaResponse })
  grandeza: GrandezaResponse

  @IsDefined()
  @ApiProperty({ description: 'Valor medido', example: 100.0 })
  valor: number

  @IsDefined()
  @ApiProperty({ description: 'Data e hora de início da coleta do valor medido', example: '2021-08-12T12:00:00' })
  dataInicial: Date

  @IsDefined()
  @ApiProperty({ description: 'Data e hora de fim da coleta do valor medido', example: '2021-08-12T12:00:00' })
  dataFinal: Date

  static toResponse(
    model: MonitoramentoRawDataModel,
    udesMap,
    sensoresMap,
    grandezasMap,
  ): MonitoramentoRawDataResponse {
    return {
      id: model.id,
      ude: UdeResponse.toResponse(udesMap[model.udeId]),
      sensor: SensorResponse.toResponse((sensoresMap[normalizeStr(model.sensor)])),
      grandeza: GrandezaResponse.toResponse(grandezasMap[normalizeStr(model.grandeza)]),
      valor: model.valor,
      dataInicial: model.dataInicial,
      dataFinal: model.dataFinal,
    }
  }
}
