import { ApiProperty } from '@nestjs/swagger'

import { IsArray, IsDefined, IsNumber, IsString, MaxLength } from 'class-validator'

import { TipoEmergenciaModel } from '@/emergency/models/TipoEmergenciaModel'
import { GrandezaResponse } from '@/emergency/structures/responses/GrandezaResponse'
import { LocalidadeResponse } from '@/locality/structures/responses/LocalidadeResponse'

export class TipoEmergenciaResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador do Tipo de Emergência', example: 1 })
  id: number

  @IsDefined()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'Nome do Tipo de Emergência', maxLength: 50, example: 'Incêndio' })
  nome: string

  @IsDefined()
  @IsArray()
  @ApiProperty({
    description: 'Lista das Grandezas associadas ao Tipo de Emergência',
    type: [GrandezaResponse]
  })
  grandezas: GrandezaResponse[]

  @IsDefined()
  @ApiProperty({ description: 'Localidade', type: LocalidadeResponse })
  localidade?: LocalidadeResponse

  static toResponse(model: TipoEmergenciaModel): TipoEmergenciaResponse {
    return {
      id: model.id,
      nome: model.nome,
      grandezas: (model.grandezas || []).map((grandeza) => GrandezaResponse.toResponse(grandeza)),
      localidade: model.localidade && LocalidadeResponse.toResponse(model.localidade),
    }
  }
}
