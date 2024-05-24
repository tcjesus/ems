import { ApiProperty } from '@nestjs/swagger'

import { IsDefined } from 'class-validator'

import { AccountModel } from '@/account/models/AccountModel'
import { Paginated } from '@/core/helpers/pagination/Paginated'

export class AccountResponse {
  @ApiProperty({ description: 'Account identifier', example: 1 })
  id: number

  @ApiProperty({ description: 'Account name', example: 'Matheus Borges' })
  nome: string

  @ApiProperty({ description: 'Account name', example: 'matob@live.com' })
  email: string

  @ApiProperty({ description: 'Account email', required: false, example: 'ADMIN' })
  role?: string

  @ApiProperty({ description: 'Account creation date', required: false, example: '2023-02-02T12:46:00.623Z' })
  createdAt?: Date

  @ApiProperty({ description: 'Account last update date', required: false, example: '2023-02-02T12:46:00.623Z' })
  updatedAt?: Date

  static toResponse (model: AccountModel): AccountResponse {
    return {
      id: model.id,
      nome: model.nome,
      email: model.email,
      role: model.role,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}

export class AccountResponsePaginated extends Paginated<AccountResponse> {
  @IsDefined()
  @ApiProperty({ description: 'Accounts', isArray: true, type: AccountResponse })
  results: AccountResponse[]
}
