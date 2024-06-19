import { ApiProperty } from '@nestjs/swagger'

import { IsArray, IsDefined, IsNumber } from 'class-validator'

import { AccountModel } from '@/account/models/AccountModel'
import { PermissionModel } from '@/account/models/PermissionModel'
import { Role } from '@/account/structures/enum/Role'
import { Paginated } from '@/core/helpers/pagination/Paginated'
import { LocalidadeResponse } from '@/locality/structures/responses/LocalidadeResponse'

export class PermissionResponse {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Identificador da permissão', example: 1 })
  id: number

  @IsDefined()
  @ApiProperty({ description: 'Role', example: Role.ADMIN })
  role: string

  @IsDefined()
  @ApiProperty({ description: 'Localidade', type: LocalidadeResponse })
  localidade: LocalidadeResponse

  static toResponse(model: PermissionModel): PermissionResponse {
    return {
      id: model.id,
      role: model.role,
      localidade: model.localidade && LocalidadeResponse.toResponse(model.localidade),
    } as any
  }
}

export class AccountResponse {
  @ApiProperty({ description: 'Account identifier', example: 1 })
  id: number

  @ApiProperty({ description: 'Account name', example: 'Matheus Borges' })
  nome: string

  @ApiProperty({ description: 'Account name', example: 'matob@live.com' })
  email: string

  @ApiProperty({ description: 'Account is super admin', example: true })
  isSuperAdmin: boolean

  @ApiProperty({ description: 'Account creation date', required: false, example: '2023-02-02T12:46:00.623Z' })
  createdAt?: Date

  @ApiProperty({ description: 'Account last update date', required: false, example: '2023-02-02T12:46:00.623Z' })
  updatedAt?: Date

  @IsDefined()
  @IsArray()
  @ApiProperty({ description: 'Account Permissions', type: [PermissionResponse] })
  permissions: PermissionResponse[]

  static toResponse (model: AccountModel): AccountResponse {
    return {
      id: model.id,
      nome: model.nome,
      email: model.email,
      isSuperAdmin: model.isSuperAdmin,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      permissions: model.permissions.map((permission) => PermissionResponse.toResponse(permission)),
    }
  }
}

export class AccountResponsePaginated extends Paginated<AccountResponse> {
  @IsDefined()
  @ApiProperty({ description: 'Accounts', isArray: true, type: AccountResponse })
  results: AccountResponse[]
}
