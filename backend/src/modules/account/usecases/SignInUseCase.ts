import { Injectable, UnauthorizedException } from '@nestjs/common'

import { AccountRepository } from '@/account/repositories/AccountRepository'
import { SignInRequest } from '@/account/structures/requests/SignInRequest'
import { AccountResponse } from '@/account/structures/responses/AccountResponse'
import { SignInResponse } from '@/account/structures/responses/SignInResponse'
import { AuthPayload } from '@/auth/interfaces/AuthPayload'
import { RoleAuthService } from '@/auth/services/RoleAuthService'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'

@Injectable()
export class SignInUseCase {
  constructor (
    private readonly accountRepository: AccountRepository,
    private readonly defaultAuthService: RoleAuthService,
  ) {}

  async execute (request: SignInRequest): Promise<SignInResponse> {
    const account = await this.accountRepository.findOneBy({ email: request.email })
    if(!account) {
      throw new UnauthorizedException(ErrorMessages.account.notFound)
    }

    const wrongPassword = !await account.checkPassword(request.password)
    if (wrongPassword) {
      throw new UnauthorizedException(ErrorMessages.account.wrongPassword)
    }

    const accountAuthData: AuthPayload = {
      account: {
        id: account.id,
        nome: account.nome,
        email: account.email,
        role: account.role,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      }
    }

    const accessToken = await this.defaultAuthService.generateAccessToken(accountAuthData)
    const refreshToken = await this.defaultAuthService.generateRefreshToken(accountAuthData)

    return {
      account: AccountResponse.toResponse(account),
      accessToken,
      refreshToken,
    }
  }
}
