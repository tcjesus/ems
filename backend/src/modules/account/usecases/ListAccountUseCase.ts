import { Injectable } from '@nestjs/common'

import { AccountRepository } from '@/account/repositories/AccountRepository'
import { AccountResponse } from '@/account/structures/responses/AccountResponse'

@Injectable()
export class ListAccountsUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) { }

  async execute(): Promise<AccountResponse[]> {
    const models = await this.accountRepository.findAll()

    return models.map(model => AccountResponse.toResponse(model))
  }
}
