import { Injectable } from '@nestjs/common'

import { AccountModel } from '@/account/models/AccountModel'
import { PermissionModel } from '@/account/models/PermissionModel'
import { AccountRepository } from '@/account/repositories/AccountRepository'
import { CreateAccountRequest, PermissionRequest } from '@/account/structures/requests/CreateAccountRequest'
import { AccountResponse } from '@/account/structures/responses/AccountResponse'
import { LocalidadeFacade } from '@/locality/services/LocalidadeFacade'

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly localidadeFacade: LocalidadeFacade,
  ) { }

  async execute({ nome, email, password, isSuperAdmin, permissions: permissionsInput }: CreateAccountRequest): Promise<AccountResponse> {
    const permissoesPromise = (permissionsInput || []).map(async (permission: PermissionRequest) => {
      const { role, cidade: cidadeId } = permission

      const localidade = await this.localidadeFacade.createIfNotExists({ cidade: { id: cidadeId.id } })

      return new PermissionModel({
        role,
        localidade
      })
    })

    const model = new AccountModel({
      nome,
      email,
      password,
      isSuperAdmin,
      permissions: await Promise.all(permissoesPromise)
    })

    const createdModel = await this.accountRepository.save(model)

    return AccountResponse.toResponse(createdModel)
  }
}
