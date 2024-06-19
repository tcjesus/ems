import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber, IsString, MaxLength } from 'class-validator'

import { ZonaModel } from '@/emergency/models/ZonaModel'
import { LocalidadeResponse } from '@/locality/structures/responses/LocalidadeResponse'

export class ZonaResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador da Zona', example: 1 })
  id: number

  @IsDefined()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'Nome da Zona', maxLength: 50, example: 'Zona 1' })
  nome: string

  @IsDefined()
  @ApiProperty({ description: 'Localidade', type: LocalidadeResponse })
  localidade?: LocalidadeResponse

  static toResponse(model: ZonaModel): ZonaResponse {
    return {
      id: model.id,
      nome: model.nome,
      localidade: model.localidade && LocalidadeResponse.toResponse(model.localidade),
    }
  }
}
