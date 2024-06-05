import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { TipoEmergenciaFacade } from '@/emergency/services/TipoEmergenciaFacade'
import { TipoEmergenciaResponse } from '@/emergency/structures/responses/TipoEmergenciaResponse'
import { CreateTipoEmergenciaRequest } from '@/emergency/structures/requests/CreateTipoEmergenciaRequest'
import { UpdateTipoEmergenciaRequest } from '@/emergency/structures/requests/UpdateTipoEmergenciaRequest'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { Role } from '@/account/structures/enum/Role'
import { Roles } from '@/auth/decorators/Roles'
import { AuditInterceptor } from '@/account/interceptors/AuditInterceptor'

@Controller({ version: '1', path: 'tipos-emergencia' })
@ApiTags('tipos-emergencia')
@UseGuards(RoleGuard)
@ApiBearerAuth('Role Access Token')
export class TipoEmergenciaController {
  constructor(private readonly tipoEmergenciaFacade: TipoEmergenciaFacade) { }

  @Get('/')
  @Roles([Role.ADMIN, Role.USER, Role.GUEST])
  @ApiOperation({ summary: 'Lista os Tipos de Emergência cadastrados no sistema' })
  @ApiOkResponse({ type: TipoEmergenciaResponse, isArray: true })
  list(): Promise<TipoEmergenciaResponse[]> {
    return this.tipoEmergenciaFacade.list()
  }

  @Get('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Busca um Tipo de Emergência pelo seu ID' })
  @ApiParam({ name: 'id', description: 'Identificador do Tipo de Emergência', type: Number, example: 1 })
  @ApiOkResponse({ type: TipoEmergenciaResponse })
  @ApiNotFoundResponse({ description: 'Tipo de Emergência não encontrado' })
  findById(
    @Param('id') id: number,
  ): Promise<TipoEmergenciaResponse> {
    return this.tipoEmergenciaFacade.findById(id)
  }

  @Post('/')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Cria um novo Tipo de Emergência' })
  @ApiCreatedResponse({ type: TipoEmergenciaResponse })
  @UseInterceptors(AuditInterceptor('tipo_emergencia'))
  create(
    @Body() request: CreateTipoEmergenciaRequest,
  ): Promise<TipoEmergenciaResponse> {
    return this.tipoEmergenciaFacade.create(request)
  }

  @Put('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Atualiza um Tipo de Emergência' })
  @ApiParam({ name: 'id', description: 'Identificador do Tipo de Emergência', type: Number, example: 1 })
  @ApiOkResponse({ type: TipoEmergenciaResponse })
  @ApiNotFoundResponse({ description: 'Tipo de Emergência não encontrado' })
  @UseInterceptors(AuditInterceptor('tipo_emergencia'))
  update(
    @Param('id') id: number,
    @Body() input: UpdateTipoEmergenciaRequest,
  ): Promise<TipoEmergenciaResponse> {
    return this.tipoEmergenciaFacade.update(id, input)
  }

  @Delete('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Deleta um Tipo de Emergência' })
  @ApiParam({ name: 'id', description: 'Identificador do Tipo de Emergência', type: Number, example: 1 })
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Tipo de Emergência não encontrado' })
  @UseInterceptors(AuditInterceptor('tipo_emergencia'))
  delete(
    @Param('id') id: number,
  ): Promise<void> {
    return this.tipoEmergenciaFacade.delete(id)
  }
}
