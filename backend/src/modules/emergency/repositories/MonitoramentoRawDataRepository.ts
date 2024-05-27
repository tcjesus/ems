import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { DatabaseRepository } from '@/core/repositories/DatabaseRepository'
import { MonitoramentoRawDataModel } from '@/emergency/models/MonitoramentoRawDataModel'
import { MonitoramentoRawDataSearchFilters } from '@/emergency/structures/queries/MonitoramentoRawDataSearchFilters'
import { PaginationOptions } from '@/core/helpers/pagination/PaginationOptions'
import { Paginated } from '@/core/helpers/pagination/Paginated'

@Injectable()
export class MonitoramentoRawDataRepository extends DatabaseRepository<MonitoramentoRawDataModel, number> {
  public constructor(@InjectRepository(MonitoramentoRawDataModel) repository: Repository<MonitoramentoRawDataModel>) {
    super(repository, 'monitoramento_raw_data')
  }

  async search(
    { dataInicial, dataFinal, grandezasNomes, udesIds }: MonitoramentoRawDataSearchFilters,
    pagination: PaginationOptions,
  ): Promise<Paginated<MonitoramentoRawDataModel>> {
    const query = this.repository.createQueryBuilder('monitoramento_raw_data')
      .innerJoinAndSelect('monitoramento_raw_data.ude', 'ude')
      .skip(pagination.offset)
      .take(pagination.limit)

    if (dataInicial) {
      query.andWhere('monitoramento_raw_data.dataFinal >= :dataInicial', { dataInicial })
    }

    if (dataFinal) {
      query.andWhere('monitoramento_raw_data.dataInicial <= :dataFinal', { dataFinal })
    }

    if (grandezasNomes?.length) {
      query.andWhere('monitoramento_raw_data.grandeza IN (:...grandezas)', { grandezas: grandezasNomes })
    }

    if (udesIds?.length) {
      query.andWhere('monitoramento_raw_data.udeId IN (:...udesIds)', { udesIds })
    }

    const [results, total] = await query.getManyAndCount()

    return {
      ...pagination,
      total,
      results,
    }
  }
}
