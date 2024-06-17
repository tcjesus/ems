import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { DatabaseRepository } from '@/core/repositories/DatabaseRepository'
import { CidadeModel } from '@/modules/locality/models/CidadeModel'

@Injectable()
export class CidadeRepository extends DatabaseRepository<CidadeModel, number> {
  public constructor(@InjectRepository(CidadeModel) repository: Repository<CidadeModel>) {
    super(repository, 'cidade')
  }

  async findBySiglaEstado(siglaEstado: string): Promise<CidadeModel[]> {
    return this.repository
      .createQueryBuilder('cidade')
      .innerJoin('cidade.estado', 'estado')
      .where('estado.sigla = :sigla', { sigla: siglaEstado.toUpperCase() })
      .getMany()
  }
}
