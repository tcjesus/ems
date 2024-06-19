import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { DatabaseRepository } from '@/core/repositories/DatabaseRepository'
import { LocalidadeModel } from '@/modules/locality/models/LocalidadeModel'

@Injectable()
export class LocalidadeRepository extends DatabaseRepository<LocalidadeModel, number> {
  public constructor(@InjectRepository(LocalidadeModel) repository: Repository<LocalidadeModel>) {
    super(repository, 'localidade', [
      { field: 'localidade.cidade', alias: 'c' },
      { field: 'c.estado' },
    ])
  }
}
