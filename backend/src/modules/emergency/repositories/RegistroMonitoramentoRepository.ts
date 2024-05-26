import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { DatabaseRepository } from '@/core/repositories/DatabaseRepository'
import { RegistroMonitoramentoModel } from '@/emergency/models/RegistroMonitoramentoModel'
import { MonitoramentoSummarySearchFilters } from '@/emergency/structures/queries/MonitoramentoSummarySearchFilters'
import { MonitoramentoSummaryResponse } from '@/emergency/structures/responses/MonitoramentoSummaryResponse'

const DEFAULT_INTERVAL = 5
const MAX_RECORDS = 1000

@Injectable()
export class RegistroMonitoramentoRepository extends DatabaseRepository<RegistroMonitoramentoModel, number> {
  public constructor(@InjectRepository(RegistroMonitoramentoModel) repository: Repository<RegistroMonitoramentoModel>) {
    super(repository, 'registro_monitoramento')
  }

  async search(
    { dataInicial, dataFinal, intervalo, grandezasIds, udesIds }: MonitoramentoSummarySearchFilters
  ): Promise<MonitoramentoSummaryResponse> {
    dataFinal = dataFinal || new Date()
    intervalo = intervalo || DEFAULT_INTERVAL

    const dataInicialMili = dataInicial.getTime()
    const dataFinalMili = dataFinal.getTime()
    const intervaloMili = intervalo * 60 * 1000
    const count = Math.ceil((dataFinalMili - dataInicialMili) / intervaloMili)

    const newIntervalo = count > MAX_RECORDS ? Math.ceil((dataFinalMili - dataInicialMili) / MAX_RECORDS) : intervaloMili

    const query = this.repository.createQueryBuilder('registro_monitoramento')
      .innerJoinAndSelect('registro_monitoramento.grandeza', 'grandeza')

    if (dataInicial) {
      query.andWhere('registro_monitoramento.dataColeta >= :dataInicial', { dataInicial })
    }

    if (dataFinal) {
      query.andWhere('registro_monitoramento.dataColeta <= :dataFinal', { dataFinal })
    }

    if (grandezasIds?.length) {
      query.andWhere('registro_monitoramento.grandezaId IN (:...grandezasIds)', { grandezasIds })
    }

    if (udesIds?.length) {
      query.andWhere('registro_monitoramento.udeId IN (:...udesIds)', { udesIds })
    }

    const records = await query.getMany()

    const groupedRecords = records.reduce((acc, record) => {
      const grandezaKey = record.grandeza!!.nome
      const grandezaAcc = acc[grandezaKey]
      if (!grandezaAcc) {
        acc[grandezaKey] = {}
      }

      const timeIndex = Math.floor((record.dataColeta.getTime() - dataInicialMili) / newIntervalo)
      if (!acc[grandezaKey][timeIndex]) {
        acc[grandezaKey][timeIndex] = { date: new Date(dataInicialMili + timeIndex * newIntervalo), values: [] }
      }

      acc[grandezaKey][timeIndex].values.push(record.valor)

      return acc
    }, {} as any)

    Object.keys(groupedRecords).forEach((key) => {
      const grandezaAcc = groupedRecords[key]
      const x: Date[] = []
      const y: number[] = []
      Object.keys(grandezaAcc).forEach((timeIndex) => {
        const r = grandezaAcc[timeIndex]
        const xi = r.date
        const yi = r.values.reduce((acc: number, value: number) => acc + value, 0) / r.values.length

        x.push(xi)
        y.push(yi)
      })

      groupedRecords[key] = { x, y }
    })

    return groupedRecords as MonitoramentoSummaryResponse
  }
}
