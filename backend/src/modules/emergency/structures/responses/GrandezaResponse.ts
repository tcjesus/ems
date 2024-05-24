import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

import { GrandezaModel } from '@/emergency/models/GrandezaModel'

export class GrandezaResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador da Grandeza', example: 1 })
  id: number

  @IsDefined()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'Nome da Grandeza', maxLength: 50, example: 'Temperatura' })
  nome: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'Unidade de Medida da Grandeza', required: false, maxLength: 50, example: 'Celsius' })
  unidadeMedida?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ description: 'Sigla da Grandeza', required: false, maxLength: 20, example: '°C' })
  sigla?: string

  static toResponse(model: GrandezaModel): GrandezaResponse {
    return {
      id: model.id,
      nome: model.nome,
      unidadeMedida: model.unidadeMedida,
      sigla: model.sigla,
    }
  }
}
