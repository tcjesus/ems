import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { Role } from '@/account/structures/enum/Role'
import { Roles } from '@/auth/decorators/Roles'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { MonitoramentoFacade } from '@/emergency/services/MonitoramentoFacade'
import { ListRegistrosMonitoramentoRequest } from '@/emergency/structures/requests/ListRegistrosMonitoramentoRequest'
import { RequestMonitoramentoRequest } from '@/emergency/structures/requests/RequestMonitoramentoRequest'
import { RegistroMonitoramentoResponse } from '@/emergency/structures/responses/RegistroMonitoramentoResponse'

@Controller({ version: '1', path: 'monitoramento' })
@ApiTags('monitoramento')
@UseGuards(RoleGuard)
@ApiBearerAuth('Role Access Token')
export class MonitoramentoController {
  constructor(private readonly monitoramentoFacade: MonitoramentoFacade) { }

  @Post('/request')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Solicita o monitoramento de uma ou mais Grandezas' })
  @ApiCreatedResponse()
  request(
    @Body() input: RequestMonitoramentoRequest,
  ): Promise<void> {
    return this.monitoramentoFacade.request(input)
  }

  @Get('/records')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Lista os Registros de Monitoramento no sistema' })
  @ApiOkResponse({ type: RegistroMonitoramentoResponse, isArray: true })
  list(
    @Body() input: ListRegistrosMonitoramentoRequest,
  ): Promise<RegistroMonitoramentoResponse[]> {
    return this.monitoramentoFacade.list(input)
  }
}
