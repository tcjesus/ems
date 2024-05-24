import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber } from 'class-validator'

import { RegistroMonitoramentoModel } from '@/emergency/models/RegistroMonitoramentoModel'
import { GrandezaResponse } from '@/emergency/structures/responses/GrandezaResponse'
import { SensorResponse } from '@/emergency/structures/responses/SensorResponse'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'

export class RegistroMonitoramentoResponse {
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
  @ApiProperty({ description: 'Valor lido', example: 100.0 })
  valor: number

  @IsDefined()
  @ApiProperty({ description: 'Data e hora da coleta do registro', example: '2021-08-12T12:00:00' })
  dataColeta: Date

  static toResponse(model: RegistroMonitoramentoModel): RegistroMonitoramentoResponse {
    return {
      id: model.id,
      ude: UdeResponse.toResponse(model.ude!!),
      sensor: SensorResponse.toResponse(model.sensor!!),
      grandeza: GrandezaResponse.toResponse(model.grandeza!!),
      valor: model.valor,
      dataColeta: model.dataColeta,
    }
  }
}
