import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { AuditInterceptor } from '@/account/interceptors/AuditInterceptor'
import { Role } from '@/account/structures/enum/Role'
import { RoleGuardParams } from '@/auth/decorators/RolesGuardParams'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { TipoEmergenciaFacade } from '@/emergency/services/TipoEmergenciaFacade'
import { CreateTipoEmergenciaRequest } from '@/emergency/structures/requests/CreateTipoEmergenciaRequest'
import { UpdateTipoEmergenciaRequest } from '@/emergency/structures/requests/UpdateTipoEmergenciaRequest'
import { TipoEmergenciaResponse } from '@/emergency/structures/responses/TipoEmergenciaResponse'
import { LOCALIDADE_HEADER } from '@/locality/helpers/LocalidadeHeader'
import { LocalidadeParam } from '@/locality/helpers/LocalidadeParam'
import { LocalidadeInterceptor } from '@/locality/interceptor/LocalidadeInterceptor'
import { Localidade } from '@/locality/structures/Localidade'

@Controller({ version: '1', path: 'tipos-emergencia' })
@ApiTags('tipos-emergencia')
@UseGuards(RoleGuard)
@ApiBearerAuth('Role Access Token')
export class TipoEmergenciaController {
  constructor(private readonly tipoEmergenciaFacade: TipoEmergenciaFacade) { }

  @Get('/')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER, Role.GUEST] })
  @ApiOperation({ summary: 'Lista os Tipos de Emergência cadastrados no sistema' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiOkResponse({ type: TipoEmergenciaResponse, isArray: true })
  list(
    @LocalidadeParam() localidade: Localidade
  ): Promise<TipoEmergenciaResponse[]> {
    return this.tipoEmergenciaFacade.list(localidade)
  }

  @Get('/:id')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Busca um Tipo de Emergência pelo seu ID' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiParam({ name: 'id', description: 'Identificador do Tipo de Emergência', type: Number, example: 1 })
  @ApiOkResponse({ type: TipoEmergenciaResponse })
  @ApiNotFoundResponse({ description: 'Tipo de Emergência não encontrado' })
  findById(
    @LocalidadeParam() localidade: Localidade,
    @Param('id') id: number,
  ): Promise<TipoEmergenciaResponse> {
    return this.tipoEmergenciaFacade.findById(localidade, id)
  }

  @Post('/')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Cria um novo Tipo de Emergência' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiCreatedResponse({ type: TipoEmergenciaResponse })
  @UseInterceptors(AuditInterceptor('tipo_emergencia'))
  create(
    @LocalidadeParam() localidade: Localidade,
    @Body() request: CreateTipoEmergenciaRequest,
  ): Promise<TipoEmergenciaResponse> {
    return this.tipoEmergenciaFacade.create(localidade, request)
  }

  @Put('/:id')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Atualiza um Tipo de Emergência' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiParam({ name: 'id', description: 'Identificador do Tipo de Emergência', type: Number, example: 1 })
  @ApiOkResponse({ type: TipoEmergenciaResponse })
  @ApiNotFoundResponse({ description: 'Tipo de Emergência não encontrado' })
  @UseInterceptors(AuditInterceptor('tipo_emergencia'))
  update(
    @LocalidadeParam() localidade: Localidade,
    @Param('id') id: number,
    @Body() input: UpdateTipoEmergenciaRequest,
  ): Promise<TipoEmergenciaResponse> {

    return this.tipoEmergenciaFacade.update(localidade, id, input)
  }

  @Delete('/:id')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Deleta um Tipo de Emergência' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiParam({ name: 'id', description: 'Identificador do Tipo de Emergência', type: Number, example: 1 })
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Tipo de Emergência não encontrado' })
  @UseInterceptors(AuditInterceptor('tipo_emergencia'))
  delete(
    @LocalidadeParam() localidade: Localidade,
    @Param('id') id: number,
  ): Promise<void> {
    return this.tipoEmergenciaFacade.delete(localidade, id)
  }
}
