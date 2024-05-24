import { ApiProperty } from '@nestjs/swagger'

import { IsArray, IsBoolean, IsDefined, IsNumber, IsOptional } from 'class-validator'

import { DeteccaoEmergenciaModel } from '@/emergency/models/DeteccaoEmergenciaModel'
import { GrandezaResponse } from '@/emergency/structures/responses/GrandezaResponse'
import { SensorResponse } from '@/emergency/structures/responses/SensorResponse'
import { TipoEmergenciaResponse } from '@/emergency/structures/responses/TipoEmergenciaResponse'
import { MonitoramentoGrandezaModel } from '@/emergency/models/MonitoramentoGrandezaModel'

export class MonitoramentoGrandezaResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador do Monitoramento de Grandeza', example: 1 })
  id: number

  @IsDefined()
  @ApiProperty({ description: 'Sensor responsável pelo monitoramento', type: SensorResponse })
  sensor: SensorResponse

  @IsDefined()
  @ApiProperty({ description: 'Grandeza monitorada', type: GrandezaResponse })
  grandeza: GrandezaResponse

  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @ApiProperty({ description: 'Threshold Mínimo', required: false, example: 20.0 })
  thresholdMinimo?: number

  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @ApiProperty({ description: 'Threshold Máximo', required: false, example: 60.0 })
  thresholdMaximo?: number

  @IsDefined()
  @IsNumber({ allowNaN: false })
  @ApiProperty({ description: 'Taxa de Amostragem em segundos do sensoriamento', example: 5 })
  intervaloAmostragem: number

  @IsDefined()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @ApiProperty({ description: 'Taxa de Variação para considerar um novo valor monitorado', example: 0.01 })
  taxaVariacaoMinima: number

  @IsDefined()
  @IsBoolean()
  @ApiProperty({ description: 'Indica se a detecção está ativa', example: true })
  ativo?: Boolean

  static toResponse(model: MonitoramentoGrandezaModel): MonitoramentoGrandezaResponse {
    return {
      id: model.id,
      sensor: SensorResponse.toResponse(model.sensor!!),
      grandeza: GrandezaResponse.toResponse(model.grandeza!!),
      thresholdMinimo: model.thresholdMinimo,
      thresholdMaximo: model.thresholdMaximo,
      intervaloAmostragem: model.intervaloAmostragem,
      taxaVariacaoMinima: model.taxaVariacaoMinima,
      ativo: model.ativo,
    } as any
  }
}

export class DeteccaoEmergenciaResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador da Configuração de Detecção de Emergência', example: 1 })
  id: number

  @IsDefined()
  @ApiProperty({ description: 'Tipo de Emergência monitorada', type: TipoEmergenciaResponse })
  tipoEmergencia: TipoEmergenciaResponse

  @IsDefined()
  @IsArray()
  @ApiProperty({ description: 'Monitoramentos de Grandeza', type: [MonitoramentoGrandezaResponse] })
  monitoramentos: MonitoramentoGrandezaResponse[]

  static toResponse(model: DeteccaoEmergenciaModel): DeteccaoEmergenciaResponse {
    return {
      id: model.id,
      tipoEmergencia: TipoEmergenciaResponse.toResponse(model.tipoEmergencia!!),
      monitoramentos: model.monitoramentosGrandeza.map((monitoramento) => MonitoramentoGrandezaResponse.toResponse(monitoramento)),
    } as any
  }
}
