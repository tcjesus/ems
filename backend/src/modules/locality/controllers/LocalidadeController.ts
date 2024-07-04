import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { AccountParam } from '@/account/helpers/AccountParam'
import { RoleGuardParams } from '@/auth/decorators/RolesGuardParams'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { Account } from '@/auth/interfaces/AuthPayload'
import { LocalidadeFacade } from '@/locality/services/LocalidadeFacade'
import { LocalidadeResponse } from '@/locality/structures/responses/LocalidadeResponse'

@Controller({ version: '1', path: 'localidades' })
@ApiTags('localidades')
@ApiBearerAuth('Role Access Token')
export class LocalidadeController {
  constructor(private readonly localidadeFacade: LocalidadeFacade) { }

  @Get('/')
  @UseGuards(RoleGuard)
  @RoleGuardParams({ requireLocalidade: false })
  @ApiOperation({ summary: 'Busca as Localidades cadastradas no sistema' })
  @ApiOkResponse({ type: LocalidadeResponse, isArray: true })
  list(
    @AccountParam() account: Account,
  ): Promise<LocalidadeResponse[]> {
    return this.localidadeFacade.list(account)
  }
}
