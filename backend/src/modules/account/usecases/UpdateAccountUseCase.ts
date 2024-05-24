import { Injectable, NotFoundException } from '@nestjs/common'

import { AccountResponse } from '@/account/structures/responses/AccountResponse'
import { UpdateAccountRequest } from '@/account/structures/requests/UpdateAccountRequest'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { AccountRepository } from '@/account/repositories/AccountRepository'

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) { }

  async execute(id: number, input: UpdateAccountRequest): Promise<AccountResponse> {
    const model = await this.accountRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.account.notFound)
    }

    const { nome, email, password, role } = input
    model.nome = nome
    model.email = email
    model.password = password
    model.role = role

    const updatedModel = await this.accountRepository.save(model)

    return AccountResponse.toResponse(updatedModel)
  }
}
