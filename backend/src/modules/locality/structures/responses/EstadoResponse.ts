import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber, IsString, MaxLength } from 'class-validator'

import { EstadoModel } from '@/locality/models/EstadoModel'

export class EstadoResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador do Estado', example: 1 })
  id: number

  @IsDefined()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'Nome do Estado', maxLength: 50, example: 'Bahia' })
  nome: string

  @IsDefined()
  @IsString()
  @MaxLength(2)
  @ApiProperty({ description: 'Sigla do Estado', maxLength: 50, example: 'BA' })
  sigla: string

  static toResponse(model: EstadoModel): EstadoResponse {
    return {
      id: model.id,
      nome: model.nome,
      sigla: model.sigla,
    }
  }
}