import { Injectable, NotFoundException } from '@nestjs/common'

import { PermissionModel } from '@/account/models/PermissionModel'
import { AccountRepository } from '@/account/repositories/AccountRepository'
import { PermissionRequest } from '@/account/structures/requests/CreateAccountRequest'
import { UpdateAccountRequest } from '@/account/structures/requests/UpdateAccountRequest'
import { AccountResponse } from '@/account/structures/responses/AccountResponse'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { LocalidadeFacade } from '@/locality/services/LocalidadeFacade'

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly localidadeFacade: LocalidadeFacade,
  ) { }

  async execute(
    id: number,
    { nome, email, password, permissions: permissionsInput }: UpdateAccountRequest
  ): Promise<AccountResponse> {
    const permissoesPromise = permissionsInput.map(async (permission: PermissionRequest) => {
      const { role, cidade: cidadeId } = permission

      const localidade = await this.localidadeFacade.createIfNotExists({ cidade: { id: cidadeId.id } })

      return new PermissionModel({
        role,
        localidade
      })
    })

    const model = await this.accountRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.account.notFound)
    }

    model.nome = nome
    model.email = email
    model.password = password
    model.permissions = await Promise.all(permissoesPromise)

    const updatedModel = await this.accountRepository.save(model)

    return AccountResponse.toResponse(updatedModel)
  }
}
