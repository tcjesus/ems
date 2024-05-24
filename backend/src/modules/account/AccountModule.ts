import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccountController } from '@/account/controllers/AccountController'
import { AccountModel } from '@/account/models/AccountModel'
import { AccountRepository } from '@/account/repositories/AccountRepository'
import { AccountFacade } from '@/account/services/AccountFacade'
import { CreateAccountUseCase } from '@/account/usecases/CreateAccountUseCase'
import { DeleteAccountUseCase } from '@/account/usecases/DeleteAccountUseCase'
import { FetchMyAccountUseCase } from '@/account/usecases/FetchMyAccountUseCase'
import { FindAccountByIdUseCase } from '@/account/usecases/FindAccountByIdUseCase'
import { ListAccountsUseCase } from '@/account/usecases/ListAccountUseCase'
import { SignInUseCase } from '@/account/usecases/SignInUseCase'
import { UpdateAccountUseCase } from '@/account/usecases/UpdateAccountUseCase'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountModel, //
    ]),
  ],
  controllers: [AccountController],
  providers: [
    // Usecases
    FetchMyAccountUseCase,
    SignInUseCase,
    ListAccountsUseCase,
    FindAccountByIdUseCase,
    CreateAccountUseCase,
    UpdateAccountUseCase,
    DeleteAccountUseCase,

    // Services
    AccountFacade,

    // Repositories
    AccountRepository,
  ],
  exports: [
    AccountFacade,
    AccountRepository,
  ]
})
export class AccountModule {}
