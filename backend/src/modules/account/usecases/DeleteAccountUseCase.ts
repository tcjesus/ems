import { AccountRepository } from '@/account/repositories/AccountRepository'
import { Injectable } from '@nestjs/common'

import { DeleteResult } from 'typeorm'

@Injectable()
export class DeleteAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) { }

  async execute(id: number): Promise<DeleteResult> {
    return this.accountRepository.delete(id)
  }
}
