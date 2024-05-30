import { Body, Controller, Delete, Get, Param, Post, Put, Response, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { AccountParam } from '@/account/helpers/AccountParam'
import { AccountFacade } from '@/account/services/AccountFacade'
import { Role } from '@/account/structures/enum/Role'
import { CreateAccountRequest } from '@/account/structures/requests/CreateAccountRequest'
import { SignInRequest } from '@/account/structures/requests/SignInRequest'
import { UpdateAccountRequest } from '@/account/structures/requests/UpdateAccountRequest'
import { AccountResponse } from '@/account/structures/responses/AccountResponse'
import { MyAccountResponse } from '@/account/structures/responses/MyAccountResponse'
import { SignInResponse } from '@/account/structures/responses/SignInResponse'
import { Roles } from '@/auth/decorators/Roles'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { Account } from '@/auth/interfaces/AuthPayload'
import { Response as Res } from 'express'
import { AuditInterceptor } from '@/account/interceptors/AuditInterceptor'

@Controller({ version: '1', path: 'usuarios' })
@ApiTags('usuarios')
@ApiBearerAuth('Role Access Token')
export class AccountController {
  constructor(
    private readonly accountFacade: AccountFacade
  ) { }

  @Get('/')
  @UseGuards(RoleGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({ summary: 'Lista os Usuários cadastrados no sistema' })
  @ApiOkResponse({ type: AccountResponse, isArray: true })
  list(): Promise<AccountResponse[]> {
    return this.accountFacade.list()
  }

  @Post('/')
  @UseGuards(RoleGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({ summary: 'Cria um novo Usuário' })
  @ApiCreatedResponse({ type: AccountResponse })
  @UseInterceptors(AuditInterceptor('account'))
  create(
    @Body() input: CreateAccountRequest,
  ): Promise<AccountResponse> {
    return this.accountFacade.create(input)
  }

  @Put('/:id')
  @UseGuards(RoleGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({ summary: 'Atualiza um Usuário' })
  @ApiParam({ name: 'id', description: 'Identificador do Usuário', type: Number, example: 1 })
  @ApiOkResponse({ type: AccountResponse })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @UseInterceptors(AuditInterceptor('account'))
  update(
    @Param('id') id: number,
    @Body() input: UpdateAccountRequest,
  ): Promise<AccountResponse> {
    return this.accountFacade.update(id, input)
  }

  @Delete('/:id')
  @UseGuards(RoleGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({ summary: 'Deleta um Usuário' })
  @ApiParam({ name: 'id', description: 'Identificador do Usuário', type: Number, example: 1 })
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @UseInterceptors(AuditInterceptor('account'))
  delete(
    @Param('id') id: number,
  ): Promise<void> {
    return this.accountFacade.delete(id)
  }

  @Post('/sign-in')
  @ApiOperation({ summary: 'Sign in' })
  @ApiOkResponse({ type: SignInResponse })
  @UseInterceptors(AuditInterceptor('account'))
  signIn(
    @Body() request: SignInRequest
  ): Promise<SignInResponse> {
    return this.accountFacade.signIn(request)
  }

  @Post('/refresh-token')
  @UseGuards(RoleGuard)
  @Roles([Role.ADMIN, Role.USER, Role.GUEST])
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiOkResponse({ type: SignInResponse })
  refreshToken(
    @Response() res: Res,
    @AccountParam() account: Account,
  ): void {
    const response = {
      account,
      accessToken: res.get('Authorization')?.replace('Bearer ', ''),
      refreshToken: res.get('X-Refresh-Token')?.replace('Bearer ', ''),
    }

    res.json(response)
  }

  @Get('/me')
  @UseGuards(RoleGuard)
  @Roles([Role.ADMIN, Role.USER, Role.GUEST])
  @ApiBearerAuth('Role Access Token')
  @ApiOperation({ summary: 'Get current Account info' })
  @ApiOkResponse({ status: 200, type: MyAccountResponse })
  me(
    @AccountParam() account: Account,
  ): Promise<MyAccountResponse> {
    return this.accountFacade.fetchMyAccount(account.id)
  }

  @Get('/:id')
  @UseGuards(RoleGuard)
  @Roles([Role.ADMIN, Role.USER, Role.GUEST])
  @ApiOperation({ summary: 'Busca um Usuário pelo seu ID' })
  @ApiParam({ name: 'id', description: 'Identificador do Usuário', type: Number, example: 1 })
  @ApiOkResponse({ type: AccountResponse })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  findById(
    @Param('id') id: number,
  ): Promise<AccountResponse> {
    return this.accountFacade.findById(id)
  }
}
