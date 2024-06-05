import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { SensorFacade } from '@/emergency/services/SensorFacade'
import { SensorResponse } from '@/emergency/structures/responses/SensorResponse'
import { CreateSensorRequest } from '@/emergency/structures/requests/CreateSensorRequest'
import { UpdateSensorRequest } from '@/emergency/structures/requests/UpdateSensorRequest'
import { Role } from '@/account/structures/enum/Role'
import { Roles } from '@/auth/decorators/Roles'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { AuditInterceptor } from '@/account/interceptors/AuditInterceptor'

@Controller({ version: '1', path: 'sensores' })
@ApiTags('sensores')
@UseGuards(RoleGuard)
@ApiBearerAuth('Role Access Token')
export class SensorController {
  constructor(private readonly SensorFacade: SensorFacade) { }

  @Get('/')
  @Roles([Role.ADMIN, Role.USER, Role.GUEST])
  @ApiOperation({ summary: 'Lista os Sensores cadastrados no sistema' })
  @ApiOkResponse({ type: SensorResponse, isArray: true })
  list(): Promise<SensorResponse[]> {
    return this.SensorFacade.list()
  }

  @Get('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Busca um Sensor pelo seu ID' })
  @ApiParam({ name: 'id', description: 'Identificador do Sensor', type: Number, example: 1 })
  @ApiOkResponse({ type: SensorResponse })
  @ApiNotFoundResponse({ description: 'Sensor não encontrado' })
  findById(
    @Param('id') id: number,
  ): Promise<SensorResponse> {
    return this.SensorFacade.findById(id)
  }

  @Post('/')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Cria um novo Sensor' })
  @ApiCreatedResponse({ type: SensorResponse })
  @UseInterceptors(AuditInterceptor('sensor'))
  create(
    @Body() input: CreateSensorRequest,
  ): Promise<SensorResponse> {
    return this.SensorFacade.create(input)
  }

  @Put('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Atualiza um Sensor' })
  @ApiParam({ name: 'id', description: 'Identificador do Sensor', type: Number, example: 1 })
  @ApiOkResponse({ type: SensorResponse })
  @ApiNotFoundResponse({ description: 'Sensor não encontrado' })
  @UseInterceptors(AuditInterceptor('sensor'))
  update(
    @Param('id') id: number,
    @Body() input: UpdateSensorRequest,
  ): Promise<SensorResponse> {
    return this.SensorFacade.update(id, input)
  }

  @Delete('/:id')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Deleta um Sensor' })
  @ApiParam({ name: 'id', description: 'Identificador do Sensor', type: Number, example: 1 })
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Sensor não encontrado' })
  @UseInterceptors(AuditInterceptor('sensor'))
  delete(
    @Param('id') id: number,
  ): Promise<void> {
    return this.SensorFacade.delete(id)
  }
}
