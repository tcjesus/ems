import { NovoRegistroMonitoramentoPayload } from '@/emergency/structures/payloads/NovoRegistroMonitoramentoPayload'
import { ListRegistrosMonitoramentoRequest } from '@/emergency/structures/requests/ListRegistrosMonitoramentoRequest'
import { RequestMonitoramentoRequest } from '@/emergency/structures/requests/RequestMonitoramentoRequest'
import { RegistroMonitoramentoResponse } from '@/emergency/structures/responses/RegistroMonitoramentoResponse'
import { ListRegistrosMonitoramentoUseCase } from '@/emergency/usecases/registro-monitoramento/ListRegistrosMonitoramentoUseCase'
import { ProcessRegistroMonitoramentoUseCase } from '@/emergency/usecases/registro-monitoramento/ProcessRegistroMonitoramentoUseCase'
import { RequestMonitoramentoUseCase } from '@/emergency/usecases/registro-monitoramento/RequestMonitoramentoUseCase'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MonitoramentoFacade {
  constructor(
    private readonly requestMonitoramentoUseCase: RequestMonitoramentoUseCase,
    private readonly processRegistroMonitoramentoUseCase: ProcessRegistroMonitoramentoUseCase,
    private readonly listRegistrosMonitoramentoUseCase: ListRegistrosMonitoramentoUseCase,
  ) { }

  request(input: RequestMonitoramentoRequest): Promise<void> {
    return this.requestMonitoramentoUseCase.execute(input)
  }

  process(input: NovoRegistroMonitoramentoPayload): Promise<void> {
    return this.processRegistroMonitoramentoUseCase.execute(input)
  }

  list(input: ListRegistrosMonitoramentoRequest): Promise<RegistroMonitoramentoResponse[]> {
    return this.listRegistrosMonitoramentoUseCase.execute(input)
  }
}
