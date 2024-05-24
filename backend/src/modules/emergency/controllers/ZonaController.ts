import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { ZonaFacade } from '@/emergency/services/ZonaFacade'
import { CreateZonaRequest } from '@/emergency/structures/requests/CreateZonaRequest'
import { UpdateZonaRequest } from '@/emergency/structures/requests/UpdateZonaRequest'
import { ZonaResponse } from '@/emergency/structures/responses/ZonaResponse'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { Roles } from '@/auth/decorators/Roles'
import { Role } from '@/account/structures/enum/Role'

@Controller({ version: '1', path: 'zonas' })
@ApiTags('zonas')
@UseGuards(RoleGuard)
@ApiBearerAuth('Role Access Token')
export class ZonaController {
  constructor(private readonly zonaFacade: ZonaFacade) { }

  @Get('/')
  @Roles([Role.ADMIN, Role.USER, Role.GUEST])
  @ApiOperation({ summary: 'Lista as Zonas cadastradas no sistema' })
  @ApiOkResponse({ type: ZonaResponse, isArray: true })
  list(): Promise<ZonaResponse[]> {
    return this.zonaFacade.list()
  }

  @Get('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Busca uma Zona pelo seu ID' })
  @ApiParam({ name: 'id', description: 'Identificador da Zona', type: Number, example: 1 })
  @ApiOkResponse({ type: ZonaResponse })
  @ApiNotFoundResponse({ description: 'Zona não encontrada' })
  findById(
    @Param('id') id: number,
  ): Promise<ZonaResponse> {
    return this.zonaFacade.findById(id)
  }

  @Post('/')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Cria uma nova Zona' })
  @ApiCreatedResponse({ type: ZonaResponse })
  create(
    @Body() input: CreateZonaRequest,
  ): Promise<ZonaResponse> {
    return this.zonaFacade.create(input)
  }

  @Put('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Atualiza uma Zona' })
  @ApiParam({ name: 'id', description: 'Identificador da Zona', type: Number, example: 1 })
  @ApiOkResponse({ type: ZonaResponse })
  @ApiNotFoundResponse({ description: 'Zona não encontrada' })
  update(
    @Param('id') id: number,
    @Body() input: UpdateZonaRequest,
  ): Promise<ZonaResponse> {
    return this.zonaFacade.update(id, input)
  }

  @Delete('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Deleta uma Zona' })
  @ApiParam({ name: 'id', description: 'Identificador da Zona', type: Number, example: 1 })
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Zona não encontrada' })
  delete(
    @Param('id') id: number,
  ): Promise<void> {
    return this.zonaFacade.delete(id)
  }
}
