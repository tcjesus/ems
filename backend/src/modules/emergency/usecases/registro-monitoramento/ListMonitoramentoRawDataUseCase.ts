import { Injectable } from '@nestjs/common'

import { MonitoramentoRawDataModel } from '@/emergency/models/MonitoramentoRawDataModel'
import { GrandezaRepository } from '@/emergency/repositories/GrandezaRepository'
import { MonitoramentoRawDataRepository } from '@/emergency/repositories/MonitoramentoRawDataRepository'
import { SensorRepository } from '@/emergency/repositories/SensorRepository'
import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { MonitoramentoRawDataSearchFilters } from '@/emergency/structures/queries/MonitoramentoRawDataSearchFilters'
import { ListMonitoramentoRawDataRequest } from '@/emergency/structures/requests/ListMonitoramentoRawDataRequest'
import { MonitoramentoRawDataResponse } from '@/emergency/structures/responses/MonitoramentoRawDataResponse'
import { PaginationOptions } from '@/core/helpers/pagination/PaginationOptions'
import { Paginated } from '@/core/helpers/pagination/Paginated'
import normalizeStr from '@/utils/normalizeStr'

@Injectable()
export class ListMonitoramentoRawDataUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
    private readonly udeRepository: UdeRepository,
    private readonly grandezaRepository: GrandezaRepository,
    private readonly sensorRepository: SensorRepository,
    private readonly monitoramentoRawDataRepository: MonitoramentoRawDataRepository,
  ) { }

  async execute(
    input: ListMonitoramentoRawDataRequest,
    pagination: PaginationOptions,
  ): Promise<Paginated<MonitoramentoRawDataResponse>> {
    const filters = await this.buildFilters(input)
    const records = await this.monitoramentoRawDataRepository.search(filters, pagination)
    return this.formatResponse(records)
  }

  private async buildFilters(
    {
      dataInicial,
      dataFinal,
      tipoEmergencia: tipoEmergenciaId,
      grandezas,
      zona: zonaId,
      ude: udeId
    }: ListMonitoramentoRawDataRequest
  ): Promise<MonitoramentoRawDataSearchFilters> {
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
      ? grandezas.map(id => parseInt(id as any))
      : tipoEmergencia
        ? tipoEmergencia.grandezas.map(grandeza => grandeza.id)
        : undefined

    const grandezasNomes = grandezasIds
      ? (await this.grandezaRepository.findManyById(grandezasIds)).map(grandeza => normalizeStr(grandeza.nome))
      : undefined

    return {
      dataInicial,
      dataFinal,
      udesIds,
      grandezasNomes,
    } as MonitoramentoRawDataSearchFilters
  }

  private async formatResponse(paginated: Paginated<MonitoramentoRawDataModel>): Promise<Paginated<MonitoramentoRawDataResponse>> {
    const results = paginated.results
    const grandezas = await this.grandezaRepository.findAll()
    const grandezasMap = grandezas.reduce((acc, grandeza) => {
      acc[normalizeStr(grandeza.nome)] = grandeza
      return acc
    }, {})

    const sensores = await this.sensorRepository.findAll({ relations: [] })
    const sensoresMap = sensores.reduce((acc, sensor) => {
      acc[normalizeStr(sensor.modelo)] = sensor
      return acc
    }, {})

    const udesIds = new Set(results.map((registroBruto) => registroBruto.udeId))
    const udes = await this.udeRepository.findManyById(Array.from(udesIds), { relations: [{ field: 'ude.zona' }] })
    const udesMap = udes.reduce((acc, ude) => {
      acc[ude.id] = ude
      return acc
    }, {})

    return {
      ...paginated,
      results: results.map(model => {
        return MonitoramentoRawDataResponse.toResponse(model, udesMap, sensoresMap, grandezasMap)
      })
    }
  }
}
