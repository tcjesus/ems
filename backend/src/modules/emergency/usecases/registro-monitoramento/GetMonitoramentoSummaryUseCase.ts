import { Injectable } from '@nestjs/common'

import { RegistroMonitoramentoRepository } from '@/emergency/repositories/RegistroMonitoramentoRepository'
import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { MonitoramentoSummarySearchFilters } from '@/emergency/structures/queries/MonitoramentoSummarySearchFilters'
import { MonitoramentoSummaryRequest } from '@/emergency/structures/requests/MonitoramentoSummaryRequest'
import { MonitoramentoSummaryResponse } from '@/emergency/structures/responses/MonitoramentoSummaryResponse'

@Injectable()
export class GetMonitoramentoSummaryUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
    private readonly udeRepository: UdeRepository,
    private readonly registroMonitoramentoRepository: RegistroMonitoramentoRepository,
  ) { }

  async execute(input: MonitoramentoSummaryRequest): Promise<MonitoramentoSummaryResponse> {
    const filters = await this.buildFilters(input)
    return this.registroMonitoramentoRepository.search(filters)
  }

  private async buildFilters(
    {
      dataInicial,
      dataFinal,
      intervalo,
      tipoEmergencia: tipoEmergenciaId,
      grandezas,
      zona: zonaId,
      ude: udeId
    }: MonitoramentoSummaryRequest
  ): Promise<MonitoramentoSummarySearchFilters> {
    const tipoEmergencia = tipoEmergenciaId
      ? await this.tipoEmergenciaRepository.findById(tipoEmergenciaId, { relations: ['grandezas'] })
      : undefined

    const udesQuery = udeId
      ? undefined
      : zonaId
        ? tipoEmergencia
          ? this.udeRepository.findManyBy({ 'ude.zonaId': zonaId, 'd.tipoEmergenciaId': tipoEmergenciaId }, { select: ['ude.id'] })
          : this.udeRepository.findManyBy({ 'ude.zonaId': zonaId }, { select: ['ude.id'] })
        : tipoEmergencia
          ? this.udeRepository.findManyBy({ 'd.tipoEmergenciaId': tipoEmergenciaId }, { select: ['ude.id'] })
          : undefined

    const udesIds = udeId
      ? [udeId]
      : (await udesQuery)?.map(ude => ude.id)

    const grandezasIds = grandezas?.length
      ? grandezas
      : tipoEmergencia
        ? tipoEmergencia.grandezas.map(grandeza => grandeza.id)
        : undefined

    return {
      dataInicial: dataInicial,
      dataFinal: dataFinal,
      intervalo,
      udesIds,
      grandezasIds,
    } as MonitoramentoSummarySearchFilters
  }
}
