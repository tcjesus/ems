import { Injectable } from '@nestjs/common'

import { RegistroMonitoramentoRepository } from '@/emergency/repositories/RegistroMonitoramentoRepository'
import { ListRegistrosMonitoramentoRequest } from '@/emergency/structures/requests/ListRegistrosMonitoramentoRequest'
import { RegistroMonitoramentoResponse } from '@/emergency/structures/responses/RegistroMonitoramentoResponse'
import { RegistrosMonitoramentoSearchFilters } from '@/emergency/structures/queries/RegistrosMonitoramentoSearchFilters'

@Injectable()
export class ListRegistrosMonitoramentoUseCase {
  constructor(
    private readonly registroMonitoramentoRepository: RegistroMonitoramentoRepository,
  ) { }

  async execute(input: ListRegistrosMonitoramentoRequest): Promise<RegistroMonitoramentoResponse[]> {
    const { zona: zonaId, tipoEmergencia: tipoEmergenciaId, ude: udeId, grandezas: grandezasIds, dataInicial, dataFinal } = input

    const filters: RegistrosMonitoramentoSearchFilters = {
      zonaId: zonaId?.id,
      tipoEmergenciaId: tipoEmergenciaId?.id,
      udeId: udeId?.id,
      grandezasIds: grandezasIds?.map(grandeza => grandeza.id),
      dataInicial,
      dataFinal,
    }

    const models = await this.registroMonitoramentoRepository.search(filters)

    return models.map(model => RegistroMonitoramentoResponse.toResponse(model))
  }
}
