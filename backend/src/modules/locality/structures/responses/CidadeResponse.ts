import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber, IsString, MaxLength } from 'class-validator'

import { CidadeModel } from '@/locality/models/CidadeModel'
import { EstadoResponse } from '@/locality/structures/responses/EstadoResponse'

export class CidadeResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador da Cidade', example: 1 })
  id: number

  @IsDefined()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'Nome da Cidade', maxLength: 50, example: 'Feira de Santana' })
  nome: string

  @IsDefined()
  @IsString()
  @MaxLength(15)
  @ApiProperty({ description: 'Código do IBGE para a Cidade', maxLength: 15, example: '123456' })
  codigoIbge: string

  @IsDefined()
  @ApiProperty({ description: 'Estado da Cidade', type: EstadoResponse })
  estado?: EstadoResponse

  static toResponse(model: CidadeModel): CidadeResponse {
    return {
      id: model.id,
      nome: model.nome,
      codigoIbge: model.codigoIbge,
      estado: model.estado && EstadoResponse.toResponse(model.estado),
    }
  }
}
