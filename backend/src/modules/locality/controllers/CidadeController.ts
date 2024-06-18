import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

import { Role } from '@/account/structures/enum/Role'
import { Roles } from '@/auth/decorators/Roles'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { CidadeFacade } from '@/locality/services/CidadeFacade'
import { CidadeResponse } from '@/locality/structures/responses/CidadeResponse'

@Controller({ version: '1', path: 'cidades' })
@ApiTags('cidades')
@UseGuards(RoleGuard)
@ApiBearerAuth('Role Access Token')
export class CidadeController {
  constructor(private readonly cidadeFacade: CidadeFacade) { }

  @Get('/')
  @Roles([Role.ADMIN, Role.USER, Role.GUEST])
  @ApiOperation({ summary: 'Busca as Cidades cadastradas no sistema a partir da sigla do estado' })
  @ApiQuery({ name: 'sigla', description: 'Sigla do Estado', type: String, example: 'BA' })
  @ApiOkResponse({ type: CidadeResponse, isArray: true })
  findByEstado(
    @Query('sigla') siglaEstado: string,
  ): Promise<CidadeResponse[]> {
    return this.cidadeFacade.findByEstado(siglaEstado)
  }
}
