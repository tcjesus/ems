import { NovoRegistroMonitoramentoPayload } from '@/emergency/structures/payloads/NovoRegistroMonitoramentoPayload'
import { ListMonitoramentoRawDataRequest } from '@/emergency/structures/requests/ListMonitoramentoRawDataRequest'
import { MonitoramentoSummaryRequest } from '@/emergency/structures/requests/MonitoramentoSummaryRequest'
import { RequestMonitoramentoDataRequest } from '@/emergency/structures/requests/RequestMonitoramentoDataRequest'
import { MonitoramentoRawDataResponse } from '@/emergency/structures/responses/MonitoramentoRawDataResponse'
import { MonitoramentoSummaryResponse } from '@/emergency/structures/responses/MonitoramentoSummaryResponse'
import { ListMonitoramentoRawDataUseCase } from '@/emergency/usecases/registro-monitoramento/ListMonitoramentoRawDataUseCase'
import { ProcessRegistroMonitoramentoUseCase } from '@/emergency/usecases/registro-monitoramento/ProcessRegistroMonitoramentoUseCase'
import { RequestMonitoramentoDataUseCase } from '@/emergency/usecases/registro-monitoramento/RequestMonitoramentoDataUseCase'
import { GetMonitoramentoSummaryUseCase } from '@/emergency/usecases/registro-monitoramento/GetMonitoramentoSummaryUseCase'
import { Injectable } from '@nestjs/common'
import { PaginationOptions } from '@/core/helpers/pagination/PaginationOptions'
import { Paginated } from '@/core/helpers/pagination/Paginated'

@Injectable()
export class MonitoramentoFacade {
  constructor(
    private readonly requestMonitoramentoDataUseCase: RequestMonitoramentoDataUseCase,
    private readonly processRegistroMonitoramentoUseCase: ProcessRegistroMonitoramentoUseCase,
    private readonly listMonitoramentoRecordsUseCase: ListMonitoramentoRawDataUseCase,
    private readonly getMonitoramentoSummaryUseCase: GetMonitoramentoSummaryUseCase,
  ) { }

  request(input: RequestMonitoramentoDataRequest): Promise<void> {
    return this.requestMonitoramentoDataUseCase.execute(input)
  }

  process(input: NovoRegistroMonitoramentoPayload): Promise<void> {
    return this.processRegistroMonitoramentoUseCase.execute(input)
  }

  listRawData(
    input: ListMonitoramentoRawDataRequest,
    pagination: PaginationOptions,
  ): Promise<Paginated<MonitoramentoRawDataResponse>> {
    return this.listMonitoramentoRecordsUseCase.execute(input, pagination)
  }

  getSummary(input: MonitoramentoSummaryRequest): Promise<MonitoramentoSummaryResponse> {
    return this.getMonitoramentoSummaryUseCase.execute(input)
  }
}
