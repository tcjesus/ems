import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccountController } from '@/account/controllers/AccountController'
import { AccountModel } from '@/account/models/AccountModel'
import { AuditModel } from '@/account/models/AuditModel'
import { AccountRepository } from '@/account/repositories/AccountRepository'
import { AuditRepository } from '@/account/repositories/AuditRepository'
import { AccountFacade } from '@/account/services/AccountFacade'
import { CreateAccountUseCase } from '@/account/usecases/CreateAccountUseCase'
import { DeleteAccountUseCase } from '@/account/usecases/DeleteAccountUseCase'
import { FetchMyAccountUseCase } from '@/account/usecases/FetchMyAccountUseCase'
import { FindAccountByIdUseCase } from '@/account/usecases/FindAccountByIdUseCase'
import { ListAccountsUseCase } from '@/account/usecases/ListAccountUseCase'
import { SignInUseCase } from '@/account/usecases/SignInUseCase'
import { UpdateAccountUseCase } from '@/account/usecases/UpdateAccountUseCase'
import { LocalityModule } from '@/locality/LocalityModule'
import { PermissionModel } from '@/account/models/PermissionModel'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountModel,
      PermissionModel,
      AuditModel,
    ]),
    forwardRef(() => LocalityModule),
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
    AuditRepository,
  ],
  exports: [
    AccountFacade,
    AccountRepository,
    AuditRepository,
  ]
})
export class AccountModule {}
