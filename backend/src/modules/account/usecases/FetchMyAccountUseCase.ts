import { Injectable, NotFoundException } from '@nestjs/common'

import { AccountRepository } from '@/account/repositories/AccountRepository'
import { MyAccountResponse } from '@/account/structures/responses/MyAccountResponse'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'

@Injectable()
export class FetchMyAccountUseCase {
  constructor (
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute (accountId: number): Promise<MyAccountResponse> {
    const account = await this.accountRepository.findById(accountId)
    if (!account) {
      throw new NotFoundException(ErrorMessages.account.notFound)
    }

    return MyAccountResponse.toResponse(account)
  }
}
