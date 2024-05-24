import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { UdeFacade } from '@/emergency/services/UdeFacade'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'
import { CreateUdeRequest } from '@/emergency/structures/requests/CreateUdeRequest'
import { UpdateUdeRequest } from '@/emergency/structures/requests/UpdateUdeRequest'
import { Roles } from '@/auth/decorators/Roles'
import { Role } from '@/account/structures/enum/Role'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { NotifyUdeUpdatedPayload } from '@/emergency/structures/payloads/NotifyUdeUpdatedPayload'

@Controller({ version: '1', path: 'udes' })
@ApiTags('udes')
  @UseGuards(RoleGuard)
@ApiBearerAuth('Role Access Token')
export class UdeController {
  constructor(private readonly udeFacade: UdeFacade) { }

  @Get('/')
  @Roles([Role.ADMIN, Role.USER])
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
  notifyUpdate(
    @Param('id') id: number,
  ): Promise<NotifyUdeUpdatedPayload> {
    return this.udeFacade.notifyUpdate(id)
  }
}
