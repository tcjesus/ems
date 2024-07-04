import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber, IsOptional } from 'class-validator'

import { LocalidadeModel } from '@/locality/models/LocalidadeModel'
import { CidadeResponse } from '@/locality/structures/responses/CidadeResponse'

export class LocalidadeResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador do Estado', example: 1 })
  id: number

  @IsOptional()
  @ApiProperty({ description: 'Cidade da localidade', type: CidadeResponse })
  cidade?: CidadeResponse

  static toResponse(model: LocalidadeModel): LocalidadeResponse {
    return {
      id: model.id,
      cidade: model.cidade && CidadeResponse.toResponse(model.cidade),
    }
  }
}