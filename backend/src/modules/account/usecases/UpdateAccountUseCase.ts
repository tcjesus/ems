import { Injectable, NotFoundException } from '@nestjs/common'

import { AccountRepository } from '@/account/repositories/AccountRepository'
import { UpdateAccountRequest } from '@/account/structures/requests/UpdateAccountRequest'
import { AccountResponse } from '@/account/structures/responses/AccountResponse'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) { }

  async execute(
    id: number,
    { nome, email, password, role }: UpdateAccountRequest
  ): Promise<AccountResponse> {
    const model = await this.accountRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.account.notFound)
    }

    model.nome = nome
    model.email = email
    model.password = password
    model.role = role

    const updatedModel = await this.accountRepository.save(model)

    return AccountResponse.toResponse(updatedModel)
  }
}
