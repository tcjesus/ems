import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { Role } from '@/account/structures/enum/Role'
import { Roles } from '@/auth/decorators/Roles'
import { MonitoramentoFacade } from '@/emergency/services/MonitoramentoFacade'
import { ListRegistrosMonitoramentoBrutoRequest } from '@/emergency/structures/requests/ListRegistrosMonitoramentoBrutoRequest'
import { RequestMonitoramentoRequest } from '@/emergency/structures/requests/RequestMonitoramentoRequest'
import { RegistroMonitoramentoBrutoResponse } from '@/emergency/structures/responses/RegistroMonitoramentoBrutoResponse'

@Controller({ version: '1', path: 'monitoramento' })
@ApiTags('monitoramento')
  // @UseGuards(RoleGuard)
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

  @Get('/bruto')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Lista os Registros Brutos de Monitoramento no sistema' })
  @ApiOkResponse({ type: RegistroMonitoramentoBrutoResponse, isArray: true })
  bruto(
    // @Body() input: ListRegistrosMonitoramentoBrutoRequest,
  ): Promise<RegistroMonitoramentoBrutoResponse[]> {
    const input: ListRegistrosMonitoramentoBrutoRequest = {}
    return this.monitoramentoFacade.bruto(input)
  }

  @Get('/summary')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Lista os Registros de Monitoramento no sistema de maneira sumarizada' })
  @ApiOkResponse({ type: RegistroMonitoramentoBrutoResponse, isArray: true })
  summary(
    // @Body() input: ListRegistrosMonitoramentoBrutoRequest,
  ): Promise<RegistroMonitoramentoBrutoResponse[]> {
    const input: ListRegistrosMonitoramentoBrutoRequest = {}
    return this.monitoramentoFacade.summary(input)
  }
}
