import { ApiProperty } from '@nestjs/swagger'

import { IsArray, IsDefined, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

import { SensorModel } from '@/emergency/models/SensorModel'
import { GrandezaResponse } from '@/emergency/structures/responses/GrandezaResponse'
import { EspecificacaoGrandezaModel } from '@/emergency/models/EspecificacaoGrandezaModel'
import { TipoSinalEnum } from '@/emergency/structures/enum/TipoSinalEnum'

class EspecificacaoGrandezaResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador da Especificação de Grandeza', example: 1 })
  id: number

  @IsDefined()
  @ApiProperty({ description: 'Grandeza especificada', type: GrandezaResponse })
  grandeza?: GrandezaResponse

  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @ApiProperty({ description: 'Valor Mínimo', required: false, example: 0.0 })
  valorMinimo?: number

  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @ApiProperty({ description: 'Valor Máximo', required: false, example: 100.0 })
  valorMaximo?: number

  @IsOptional()
  @IsEnum(TipoSinalEnum)
  @ApiProperty({ description: 'Tipo de Sinal', enum: TipoSinalEnum, required: false, example: 'DIGITAL' })
  sinal?: TipoSinalEnum

  static toResponse(model: EspecificacaoGrandezaModel): EspecificacaoGrandezaResponse {
    const response: EspecificacaoGrandezaResponse = {
      id: model.id,
      valorMinimo: model.valorMinimo && parseFloat(`${model.valorMinimo}`),
      valorMaximo: model.valorMaximo && parseFloat(`${model.valorMaximo}`),
      sinal: model.sinal,
    }

    if (model.grandeza) {
      response.grandeza = GrandezaResponse.toResponse(model.grandeza)
    }

    return response
  }
}

export class SensorResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador do Sensor', example: 1 })
  id: number

  @IsDefined()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'Modelo do Sensor', maxLength: 50, example: 'CM18-2008A' })
  modelo: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Descrição do Sensor',
    required: false,
    maxLength: 255,
    example: 'Sensor Com Cabo Capacitivo CM18-2008A não faceado 18mm 90-250Vca (NA) C/ 2 Fios e Range 8mm'
  })
  descricao?: string

  @IsDefined()
  @IsArray()
  @ApiProperty({
    description: 'Lista de Especificações de Grandeza do Sensor',
    type: [EspecificacaoGrandezaResponse]
  })
  especificacoes: EspecificacaoGrandezaResponse[]

  static toResponse(model: SensorModel): SensorResponse {
    const especificacoes = (model.especificacoes || [])
      .map((especificacao) => EspecificacaoGrandezaResponse.toResponse(especificacao))

    return {
      id: model.id,
      modelo: model.modelo,
      descricao: model.descricao,
      especificacoes
    }
  }
}
