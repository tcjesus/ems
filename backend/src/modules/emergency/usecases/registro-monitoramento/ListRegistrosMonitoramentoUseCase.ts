import { Injectable } from '@nestjs/common'

import { GrandezaRepository } from '@/emergency/repositories/GrandezaRepository'
import { RegistroMonitoramentoBrutoRepository } from '@/emergency/repositories/RegistroMonitoramentoBrutoRepository'
import { SensorRepository } from '@/emergency/repositories/SensorRepository'
import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { RegistrosMonitoramentoSearchFilters } from '@/emergency/structures/queries/RegistrosMonitoramentoSearchFilters'
import { ListRegistrosMonitoramentoBrutoRequest } from '@/emergency/structures/requests/ListRegistrosMonitoramentoBrutoRequest'
import { RegistroMonitoramentoBrutoResponse } from '@/emergency/structures/responses/RegistroMonitoramentoBrutoResponse'

@Injectable()
export class ListRegistrosMonitoramentoBrutoUseCase {
  constructor(
    private readonly registroMonitoramentoBrutoRepository: RegistroMonitoramentoBrutoRepository,
    private readonly sensorRepository: SensorRepository,
    private readonly grandezaRepository: GrandezaRepository,
    private readonly udeRepository: UdeRepository,
  ) { }

  async execute(input: ListRegistrosMonitoramentoBrutoRequest): Promise<RegistroMonitoramentoBrutoResponse[]> {
    const { zona: zonaId, tipoEmergencia: tipoEmergenciaId, ude: udeId, grandezas: grandezasIds, dataInicial, dataFinal } = input

    const filters: RegistrosMonitoramentoSearchFilters = {
      zonaId: zonaId?.id,
      tipoEmergenciaId: tipoEmergenciaId?.id,
      udeId: udeId?.id,
      grandezasIds: grandezasIds?.map(grandeza => grandeza.id),
      dataInicial,
      dataFinal,
    }

    const registrosBrutos = await this.registroMonitoramentoBrutoRepository.search(filters)

    const grandezas = await this.grandezaRepository.findAll()
    const grandezasMap = grandezas.reduce((acc, grandeza) => {
      acc[grandeza.nome.toLocaleLowerCase()] = grandeza
      return acc
    }, {})

    const sensores = await this.sensorRepository.findAll([])
    const sensoresMap = sensores.reduce((acc, sensor) => {
      acc[sensor.modelo.toLocaleLowerCase()] = sensor
      return acc
    }, {})

    const udesIds = new Set(registrosBrutos.map((registroBruto) => registroBruto.udeId))
    const udes = await this.udeRepository.findManyById(Array.from(udesIds), [{ field: 'ude.zona' }])
    const udesMap = udes.reduce((acc, ude) => {
      acc[ude.id] = ude
      return acc
    }, {})

    return registrosBrutos.map(model => {
      return RegistroMonitoramentoBrutoResponse.toResponse(model, udesMap, sensoresMap, grandezasMap)
    })
  }
}
