import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { AuditInterceptor } from '@/account/interceptors/AuditInterceptor'
import { Role } from '@/account/structures/enum/Role'
import { RoleGuardParams } from '@/auth/decorators/RolesGuardParams'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { ZonaFacade } from '@/emergency/services/ZonaFacade'
import { CreateZonaRequest } from '@/emergency/structures/requests/CreateZonaRequest'
import { UpdateZonaRequest } from '@/emergency/structures/requests/UpdateZonaRequest'
import { ZonaResponse } from '@/emergency/structures/responses/ZonaResponse'
import { LOCALIDADE_HEADER } from '@/locality/helpers/LocalidadeHeader'
import { LocalidadeParam } from '@/locality/helpers/LocalidadeParam'
import { LocalidadeInterceptor } from '@/locality/interceptor/LocalidadeInterceptor'
import { Localidade } from '@/locality/structures/Localidade'

@Controller({ version: '1', path: 'zonas' })
@ApiTags('zonas')
@UseGuards(RoleGuard)
@ApiBearerAuth('Role Access Token')
export class ZonaController {
  constructor(private readonly zonaFacade: ZonaFacade) { }

  @Get('/')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER, Role.GUEST] })
  @ApiOperation({ summary: 'Lista as Zonas cadastradas no sistema' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiOkResponse({ type: ZonaResponse, isArray: true })
  list(
    @LocalidadeParam() localidade: Localidade
  ): Promise<ZonaResponse[]> {
    return this.zonaFacade.list(localidade)
  }

  @Get('/:id')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Busca uma Zona pelo seu ID' })
  @ApiParam({ name: 'id', description: 'Identificador da Zona', type: Number, example: 1 })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiOkResponse({ type: ZonaResponse })
  @ApiNotFoundResponse({ description: 'Zona não encontrada' })
  findById(
    @LocalidadeParam() localidade: Localidade,
    @Param('id') id: number,
  ): Promise<ZonaResponse> {
    return this.zonaFacade.findById(localidade, id)
  }

  @Post('/')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Cria uma nova Zona' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @UseInterceptors(LocalidadeInterceptor)
  @ApiCreatedResponse({ type: ZonaResponse })
  @UseInterceptors(AuditInterceptor('zona'))
  create(
    @LocalidadeParam() localidade: Localidade,
    @Body() input: CreateZonaRequest,
  ): Promise<ZonaResponse> {
    return this.zonaFacade.create(localidade, input)
  }

  @Put('/:id')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Atualiza uma Zona' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiParam({ name: 'id', description: 'Identificador da Zona', type: Number, example: 1 })
  @ApiOkResponse({ type: ZonaResponse })
  @ApiNotFoundResponse({ description: 'Zona não encontrada' })
  @UseInterceptors(AuditInterceptor('zona'))
  update(
    @LocalidadeParam() localidade: Localidade,
    @Param('id') id: number,
    @Body() input: UpdateZonaRequest,
  ): Promise<ZonaResponse> {
    return this.zonaFacade.update(localidade, id, input)
  }

  @Delete('/:id')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Deleta uma Zona' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiParam({ name: 'id', description: 'Identificador da Zona', type: Number, example: 1 })
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Zona não encontrada' })
  @UseInterceptors(AuditInterceptor('zona'))
  delete(
    @LocalidadeParam() localidade: Localidade,
    @Param('id') id: number,
  ): Promise<void> {
    return this.zonaFacade.delete(localidade, id)
  }
}
