import { Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

import { Role } from '@/account/structures/enum/Role'
import { Roles } from '@/auth/decorators/Roles'
import { RoleGuard } from '@/auth/guards/RoleGuard'
import { ParseDatePipe } from '@/core/helpers/ParseDatePipe'
import { Paginated } from '@/core/helpers/pagination/Paginated'
import { PaginationInterceptor } from '@/core/helpers/pagination/PaginationInterceptor'
import { PaginationOptions } from '@/core/helpers/pagination/PaginationOptions'
import { PaginationParam } from '@/core/helpers/pagination/PaginationParam'
import { MonitoramentoFacade } from '@/emergency/services/MonitoramentoFacade'
import { ListMonitoramentoRawDataRequest } from '@/emergency/structures/requests/ListMonitoramentoRawDataRequest'
import { MonitoramentoSummaryRequest } from '@/emergency/structures/requests/MonitoramentoSummaryRequest'
import { RequestMonitoramentoDataRequest } from '@/emergency/structures/requests/RequestMonitoramentoDataRequest'
import { MonitoramentoRawDataResponse } from '@/emergency/structures/responses/MonitoramentoRawDataResponse'
import { MonitoramentoSummaryResponse } from '@/emergency/structures/responses/MonitoramentoSummaryResponse'

@Controller({ version: '1', path: 'monitoramento' })
@ApiTags('monitoramento')
  @UseGuards(RoleGuard)
@ApiBearerAuth('Role Access Token')
export class MonitoramentoController {
  constructor(private readonly monitoramentoFacade: MonitoramentoFacade) { }

  @Post('/request')
  @Roles([Role.ADMIN, Role.USER])
  @ApiQuery({ name: 'tipoEmergencia', description: 'Identificador do Tipo de Emergência a ser fitlrado', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'grandezas', description: 'Identificadores das grandezas a serem filtradas', required: false, type: [Number], example: [1, 2, 3] })
  @ApiQuery({ name: 'zona', description: 'Identificador da Zona a ser filtrada', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'ude', description: 'Identificador da UDE a ser filtrada', required: false, type: Number, example: 1 })
  @ApiOperation({ summary: 'Solicita o monitoramento de uma ou mais Grandezas' })
  @ApiCreatedResponse()
  request(
    @Query('tipoEmergencia') tipoEmergencia?: number,
    @Query('grandezas') grandezas?: number[],
    @Query('zona') zona?: number,
    @Query('ude') ude?: number,
  ): Promise<void> {
    const input: RequestMonitoramentoDataRequest = {
      tipoEmergencia,
      grandezas: grandezas || [],
      zona,
      ude,
    }

    return this.monitoramentoFacade.request(input)
  }

  @Get('/raw-data')
  @UseInterceptors(PaginationInterceptor(10))
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Lista os Registros de Monitoramento no sistema' })
  @ApiQuery({ name: 'dataInicial', description: 'Data de início da busca', required: true, type: Date, example: '2024-05-01T00:00:00.000Z' })
  @ApiQuery({ name: 'dataFinal', description: 'Data de fim da busca', required: false, type: Date, example: '2024-05-01T00:00:00.000Z' })
  @ApiQuery({ name: 'tipoEmergencia', description: 'Identificador do Tipo de Emergência a ser fitlrado', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'grandezas', description: 'Identificadores das grandezas a serem filtradas', required: false, type: [Number], example: [1, 2, 3] })
  @ApiQuery({ name: 'zona', description: 'Identificador da Zona a ser filtrada', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'ude', description: 'Identificador da UDE a ser filtrada', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'page', description: 'Records page number', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Records count limit', type: Number, example: 10 })
  @ApiOkResponse({ type: MonitoramentoRawDataResponse, isArray: true })
  listRawData(
    @PaginationParam() pagination: PaginationOptions,

    @Query('dataInicial', ParseDatePipe) dataInicial: Date,
    @Query('dataFinal', ParseDatePipe) dataFinal?: Date,

    @Query('tipoEmergencia') tipoEmergencia?: number,
    @Query('grandezas') grandezas?: number[],
    @Query('zona') zona?: number,
    @Query('ude') ude?: number,
  ): Promise<Paginated<MonitoramentoRawDataResponse>> {
    const input: ListMonitoramentoRawDataRequest = {
      dataInicial,
      dataFinal,

      tipoEmergencia,
      grandezas: grandezas || [],
      zona,
      ude,
    }

    return this.monitoramentoFacade.listRawData(input, pagination)
  }

  @Get('/summary')
  @Roles([Role.ADMIN, Role.USER])
  @ApiOperation({ summary: 'Lista os Registros de Monitoramento no sistema de maneira sumarizada' })
  @ApiQuery({ name: 'dataInicial', description: 'Data de início da busca', required: true, type: Date, example: '2024-05-01T00:00:00.000Z' })
  @ApiQuery({ name: 'dataFinal', description: 'Data de fim da busca', required: false, type: Date, example: '2024-05-01T00:00:00.000Z' })
  @ApiQuery({ name: 'intervalo', description: 'Intervalo em minutos de agrupamento das medições', required: false, type: Number, example: 5 })
  @ApiQuery({ name: 'tipoEmergencia', description: 'Identificador do Tipo de Emergência a ser fitlrado', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'grandezas', description: 'Identificadores das grandezas a serem filtradas', required: false, type: [Number], example: [1, 2, 3] })
  @ApiQuery({ name: 'zona', description: 'Identificador da Zona a ser filtrada', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'ude', description: 'Identificador da UDE a ser filtrada', required: false, type: Number, example: 1 })
  @ApiOkResponse({ type: MonitoramentoSummaryResponse })
  getSummary(
    @Query('dataInicial', ParseDatePipe) dataInicial: Date,
    @Query('dataFinal', ParseDatePipe) dataFinal?: Date,
    @Query('intervalo') intervalo?: number, // (em minutos

    @Query('tipoEmergencia') tipoEmergencia?: number,
    @Query('grandezas') grandezas?: number[],
    @Query('zona') zona?: number,
    @Query('ude') ude?: number,
  ): Promise<MonitoramentoSummaryResponse> {
    const input: MonitoramentoSummaryRequest = {
      dataInicial,
      dataFinal,
      intervalo,

      tipoEmergencia,
      grandezas: grandezas || [],
      zona,
      ude,
    }

    return this.monitoramentoFacade.getSummary(input)
  }
}
