import { Injectable } from '@nestjs/common'

import { AccountModel } from '@/account/models/AccountModel'
import { AccountRepository } from '@/account/repositories/AccountRepository'
import { CreateAccountRequest } from '@/account/structures/requests/CreateAccountRequest'
import { AccountResponse } from '@/account/structures/responses/AccountResponse'

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) { }

  async execute(input: CreateAccountRequest): Promise<AccountResponse> {
    const { nome, email, password, role } = input

    const model = new AccountModel({
      nome,
      email,
      password,
      role,
    })

    const createdModel = await this.accountRepository.save(model)

    return AccountResponse.toResponse(createdModel)
  }
}
