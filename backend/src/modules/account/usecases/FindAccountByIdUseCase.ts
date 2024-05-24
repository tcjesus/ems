import { Injectable, NotFoundException } from '@nestjs/common'

import { AccountResponse } from '@/account/structures/responses/AccountResponse'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { AccountRepository } from '@/account/repositories/AccountRepository'

@Injectable()
export class FindAccountByIdUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) { }

  async execute(id: number): Promise<AccountResponse> {
    const model = await this.accountRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.account.notFound)
    }

    return AccountResponse.toResponse(model)
  }
}
