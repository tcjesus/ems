import { NovoRegistroMonitoramentoPayload } from '@/emergency/structures/payloads/NovoRegistroMonitoramentoPayload'
import { ListRegistrosMonitoramentoBrutoRequest } from '@/emergency/structures/requests/ListRegistrosMonitoramentoBrutoRequest'
import { RequestMonitoramentoRequest } from '@/emergency/structures/requests/RequestMonitoramentoRequest'
import { RegistroMonitoramentoBrutoResponse } from '@/emergency/structures/responses/RegistroMonitoramentoBrutoResponse'
import { ListRegistrosMonitoramentoBrutoUseCase } from '@/emergency/usecases/registro-monitoramento/ListRegistrosMonitoramentoUseCase'
import { ProcessRegistroMonitoramentoUseCase } from '@/emergency/usecases/registro-monitoramento/ProcessRegistroMonitoramentoUseCase'
import { RequestMonitoramentoUseCase } from '@/emergency/usecases/registro-monitoramento/RequestMonitoramentoUseCase'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MonitoramentoFacade {
  constructor(
    private readonly requestMonitoramentoUseCase: RequestMonitoramentoUseCase,
    private readonly processRegistroMonitoramentoUseCase: ProcessRegistroMonitoramentoUseCase,
    private readonly listRegistrosMonitoramentoBrutoUseCase: ListRegistrosMonitoramentoBrutoUseCase,
  ) { }

  request(input: RequestMonitoramentoRequest): Promise<void> {
    return this.requestMonitoramentoUseCase.execute(input)
  }

  process(input: NovoRegistroMonitoramentoPayload): Promise<void> {
    return this.processRegistroMonitoramentoUseCase.execute(input)
  }

  bruto(input: ListRegistrosMonitoramentoBrutoRequest): Promise<RegistroMonitoramentoBrutoResponse[]> {
    return this.listRegistrosMonitoramentoBrutoUseCase.execute(input)
  }

  summary(input: ListRegistrosMonitoramentoBrutoRequest): Promise<RegistroMonitoramentoBrutoResponse[]> {
    return this.listRegistrosMonitoramentoBrutoUseCase.execute(input)
  }
}
