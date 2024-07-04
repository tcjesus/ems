import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber, IsOptional } from 'class-validator'

import { Role } from '@/account/structures/enum/Role'
import { LocalidadeModel } from '@/locality/models/LocalidadeModel'
import { CidadeResponse } from '@/locality/structures/responses/CidadeResponse'
import { LocalidadeResponse } from '@/locality/structures/responses/LocalidadeResponse'

export class ListLocalidadeResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador do Estado', example: 1 })
  id: number

  @IsOptional()
  @ApiProperty({ description: 'Cidade da localidade', type: CidadeResponse })
  cidade?: CidadeResponse

  @IsDefined()
  @ApiProperty({ description: 'Role do usuário', enum: Role, example: Role.ADMIN })
  role: Role

  static toResponse(model: LocalidadeModel, role: Role): ListLocalidadeResponse {
    return {
      ...LocalidadeResponse.toResponse(model),
      role,
    }
  }
}