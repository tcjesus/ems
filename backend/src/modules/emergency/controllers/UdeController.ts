import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { AuditInterceptor } from '@/account/interceptors/AuditInterceptor'
import { Role } from '@/account/structures/enum/Role'
import { RoleGuardParams } from '@/auth/decorators/RolesGuardParams'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { UdeFacade } from '@/emergency/services/UdeFacade'
import { NotifyUdeUpdatedPayload } from '@/emergency/structures/payloads/NotifyUdeUpdatedPayload'
import { CreateUdeRequest } from '@/emergency/structures/requests/CreateUdeRequest'
import { UpdateUdeRequest } from '@/emergency/structures/requests/UpdateUdeRequest'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'
import { LOCALIDADE_HEADER } from '@/locality/helpers/LocalidadeHeader'
import { LocalidadeParam } from '@/locality/helpers/LocalidadeParam'
import { LocalidadeInterceptor } from '@/locality/interceptor/LocalidadeInterceptor'
import { Localidade } from '@/locality/structures/Localidade'

@Controller({ version: '1', path: 'udes' })
@ApiTags('udes')
  @UseGuards(RoleGuard)
@ApiBearerAuth('Role Access Token')
export class UdeController {
  constructor(private readonly udeFacade: UdeFacade) { }

  @Get('/')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER, Role.GUEST] })
  @ApiOperation({ summary: 'Lista as UDEs cadastradas no sistema' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiOkResponse({ type: UdeResponse, isArray: true })
  list(
    @LocalidadeParam() localidade: Localidade,
  ): Promise<UdeResponse[]> {
    return this.udeFacade.list(localidade)
  }

  @Get('/:id')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Busca uma UDE pelo seu ID' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiParam({ name: 'id', description: 'Identificador da Ude', type: Number, example: 1 })
  @ApiOkResponse({ type: UdeResponse })
  @ApiNotFoundResponse({ description: 'UDE não encontrada' })
  findById(
    @LocalidadeParam() localidade: Localidade,
    @Param('id') id: number,
  ): Promise<UdeResponse> {
    return this.udeFacade.findById(localidade, id)
  }

  @Post('/')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Cria uma nova UDE' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiCreatedResponse({ type: UdeResponse })
  @UseInterceptors(AuditInterceptor('ude'))
  create(
    @LocalidadeParam() localidade: Localidade,
    @Body() input: CreateUdeRequest,
  ): Promise<UdeResponse> {
    return this.udeFacade.create(localidade, input)
  }

  @Put('/:id')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Atualiza uma UDE' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiParam({ name: 'id', description: 'Identificador da UDE', type: Number, example: 1 })
  @ApiOkResponse({ type: UdeResponse })
  @ApiNotFoundResponse({ description: 'UDE não encontrada' })
  @UseInterceptors(AuditInterceptor('ude'))
  update(
    @LocalidadeParam() localidade: Localidade,
    @Param('id') id: number,
    @Body() input: UpdateUdeRequest,
  ): Promise<UdeResponse> {
    return this.udeFacade.update(localidade, id, input)
  }

  @Delete('/:id')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Deleta uma UDE' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiParam({ name: 'id', description: 'Identificador da UDE', type: Number, example: 1 })
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'UDE não encontrada' })
  @UseInterceptors(AuditInterceptor('ude'))
  delete(
    @LocalidadeParam() localidade: Localidade,
    @Param('id') id: number,
  ): Promise<void> {
    return this.udeFacade.delete(localidade, id)
  }

  @Post('/:id')
  @RoleGuardParams({ roles: [Role.ADMIN, Role.USER] })
  @ApiOperation({ summary: 'Força a notificação de atualização de uma UDE com os dados atuais' })
  @ApiHeader({ name: LOCALIDADE_HEADER, description: 'Localidade em formato json', example: '{"id": 1, "cidadeId": 1}' })
  @UseInterceptors(LocalidadeInterceptor)
  @ApiParam({ name: 'id', description: 'Identificador da UDE', type: Number, example: 1 })
  @ApiOkResponse()
  @UseInterceptors(AuditInterceptor())
  notifyUpdate(
    @LocalidadeParam() localidade: Localidade,
    @Param('id') id: number,
  ): Promise<NotifyUdeUpdatedPayload> {
    return this.udeFacade.notifyUpdate(localidade, id)
  }
}
