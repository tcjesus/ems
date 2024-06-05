import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { AuditInterceptor } from '@/account/interceptors/AuditInterceptor'
import { Role } from '@/account/structures/enum/Role'
import { Roles } from '@/auth/decorators/Roles'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { UdeFacade } from '@/emergency/services/UdeFacade'
import { NotifyUdeUpdatedPayload } from '@/emergency/structures/payloads/NotifyUdeUpdatedPayload'
import { CreateUdeRequest } from '@/emergency/structures/requests/CreateUdeRequest'
import { UpdateUdeRequest } from '@/emergency/structures/requests/UpdateUdeRequest'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'

@Controller({ version: '1', path: 'udes' })
@ApiTags('udes')
  @UseGuards(RoleGuard)
@ApiBearerAuth('Role Access Token')
export class UdeController {
  constructor(private readonly udeFacade: UdeFacade) { }

  @Get('/')
  @Roles([Role.ADMIN, Role.USER, Role.GUEST])
  @ApiOperation({ summary: 'Lista as UDEs cadastradas no sistema' })
  @ApiOkResponse({ type: UdeResponse, isArray: true })
  list(): Promise<UdeResponse[]> {
    return this.udeFacade.list()
  }

  @Get('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Busca uma UDE pelo seu ID' })
  @ApiParam({ name: 'id', description: 'Identificador da Ude', type: Number, example: 1 })
  @ApiOkResponse({ type: UdeResponse })
  @ApiNotFoundResponse({ description: 'UDE não encontrada' })
  findById(
    @Param('id') id: number,
  ): Promise<UdeResponse> {
    return this.udeFacade.findById(id)
  }

  @Post('/')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Cria uma nova UDE' })
  @ApiCreatedResponse({ type: UdeResponse })
  @UseInterceptors(AuditInterceptor('ude'))
  create(
    @Body() input: CreateUdeRequest,
  ): Promise<UdeResponse> {
    return this.udeFacade.create(input)
  }

  @Put('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Atualiza uma UDE' })
  @ApiParam({ name: 'id', description: 'Identificador da UDE', type: Number, example: 1 })
  @ApiOkResponse({ type: UdeResponse })
  @ApiNotFoundResponse({ description: 'UDE não encontrada' })
  @UseInterceptors(AuditInterceptor('ude'))
  update(
    @Param('id') id: number,
    @Body() input: UpdateUdeRequest,
  ): Promise<UdeResponse> {
    return this.udeFacade.update(id, input)
  }

  @Delete('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Deleta uma UDE' })
  @ApiParam({ name: 'id', description: 'Identificador da UDE', type: Number, example: 1 })
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'UDE não encontrada' })
  @UseInterceptors(AuditInterceptor('ude'))
  delete(
    @Param('id') id: number,
  ): Promise<void> {
    return this.udeFacade.delete(id)
  }

  @Post('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Força a notificação de atualização de uma UDE com os dados atuais' })
  @ApiParam({ name: 'id', description: 'Identificador da UDE', type: Number, example: 1 })
  @ApiOkResponse()
  @UseInterceptors(AuditInterceptor())
  notifyUpdate(
    @Param('id') id: number,
  ): Promise<NotifyUdeUpdatedPayload> {
    return this.udeFacade.notifyUpdate(id)
  }
}
