import { Injectable } from '@nestjs/common'

import { CreateAccountRequest } from '@/account/structures/requests/CreateAccountRequest'
import { SignInRequest } from '@/account/structures/requests/SignInRequest'
import { AccountResponse } from '@/account/structures/responses/AccountResponse'
import { MyAccountResponse } from '@/account/structures/responses/MyAccountResponse'
import { SignInResponse } from '@/account/structures/responses/SignInResponse'
import { CreateAccountUseCase } from '@/account/usecases/CreateAccountUseCase'
import { DeleteAccountUseCase } from '@/account/usecases/DeleteAccountUseCase'
import { FetchMyAccountUseCase } from '@/account/usecases/FetchMyAccountUseCase'
import { FindAccountByIdUseCase } from '@/account/usecases/FindAccountByIdUseCase'
import { ListAccountsUseCase } from '@/account/usecases/ListAccountUseCase'
import { SignInUseCase } from '@/account/usecases/SignInUseCase'
import { UpdateAccountUseCase } from '@/account/usecases/UpdateAccountUseCase'

@Injectable()
export class AccountFacade {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly fetchMyAccountUseCase: FetchMyAccountUseCase,
    private readonly listAccountsUseCase: ListAccountsUseCase,
    private readonly findAccountByIdUseCase: FindAccountByIdUseCase,
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
  ) { }

  list(): Promise<AccountResponse[]> {
    return this.listAccountsUseCase.execute()
  }

  findById(id: number): Promise<AccountResponse> {
    return this.findAccountByIdUseCase.execute(id)
  }

  create(input: CreateAccountRequest): Promise<AccountResponse> {
    return this.createAccountUseCase.execute(input)
  }

  update(id: number, input: CreateAccountRequest): Promise<AccountResponse> {
    return this.updateAccountUseCase.execute(id, input)
  }

  async delete(id: number): Promise<void> {
    await this.deleteAccountUseCase.execute(id)
  }

  signIn(request: SignInRequest): Promise<SignInResponse> {
    return this.signInUseCase.execute(request)
  }

  fetchMyAccount(accountId: number): Promise<MyAccountResponse> {
    return this.fetchMyAccountUseCase.execute(accountId)
  }
}
