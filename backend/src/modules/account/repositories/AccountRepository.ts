import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { AccountModel } from '@/account/models/AccountModel'
import { DatabaseRepository } from '@/core/repositories/DatabaseRepository'

@Injectable()
export class AccountRepository extends DatabaseRepository<AccountModel, number> {
  public constructor(@InjectRepository(AccountModel) repository: Repository<AccountModel>) {
    super(repository, 'account', [
      { field: 'account.permissions', alias: 'p' },
      { field: 'p.localidade', alias: 'l' },
      { field: 'l.cidade', alias: 'c', join: 'LEFT' },
    ])
  }
}
