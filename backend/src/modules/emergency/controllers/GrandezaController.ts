import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { Role } from '@/account/structures/enum/Role'
import { Roles } from '@/auth/decorators/Roles'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { GrandezaFacade } from '@/emergency/services/GrandezaFacade'
import { CreateGrandezaRequest } from '@/emergency/structures/requests/CreateGrandezaRequest'
import { UpdateGrandezaRequest } from '@/emergency/structures/requests/UpdateGrandezaRequest'
import { GrandezaResponse } from '@/emergency/structures/responses/GrandezaResponse'
import { AuditInterceptor } from '@/account/interceptors/AuditInterceptor'

@Controller({ version: '1', path: 'grandezas' })
@ApiTags('grandezas')
@UseGuards(RoleGuard)
@ApiBearerAuth('Role Access Token')
export class GrandezaController {
  constructor(private readonly grandezaFacade: GrandezaFacade) { }

  @Get('/')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Lista as Grandezas cadastradas no sistema' })
  @ApiOkResponse({ type: GrandezaResponse, isArray: true })
  list(): Promise<GrandezaResponse[]> {
    return this.grandezaFacade.list()
  }

  @Get('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Busca uma Grandeza pelo seu ID' })
  @ApiParam({ name: 'id', description: 'Identificador da Grandeza', type: Number, example: 1 })
  @ApiOkResponse({ type: GrandezaResponse })
  @ApiNotFoundResponse({ description: 'Grandeza não encontrada' })
  findById(
    @Param('id') id: number,
  ): Promise<GrandezaResponse> {
    return this.grandezaFacade.findById(id)
  }

  @Post('/')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Cria uma nova Grandeza' })
  @ApiCreatedResponse({ type: GrandezaResponse })
  @UseInterceptors(AuditInterceptor('grandeza'))
  create(
    @Body() input: CreateGrandezaRequest,
  ): Promise<GrandezaResponse> {
    return this.grandezaFacade.create(input)
  }

  @Put('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Atualiza uma Grandeza' })
  @ApiParam({ name: 'id', description: 'Identificador da Grandeza', type: Number, example: 1 })
  @ApiOkResponse({ type: GrandezaResponse })
  @ApiNotFoundResponse({ description: 'Grandeza não encontrada' })
  @UseInterceptors(AuditInterceptor('grandeza'))
  update(
    @Param('id') id: number,
    @Body() input: UpdateGrandezaRequest,
  ): Promise<GrandezaResponse> {
    return this.grandezaFacade.update(id, input)
  }

  @Delete('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Deleta uma Grandeza' })
  @ApiParam({ name: 'id', description: 'Identificador da Grandeza', type: Number, example: 1 })
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Grandeza não encontrada' })
  @UseInterceptors(AuditInterceptor('grandeza'))
  delete(
    @Param('id') id: number,
  ): Promise<void> {
    return this.grandezaFacade.delete(id)
  }
}
