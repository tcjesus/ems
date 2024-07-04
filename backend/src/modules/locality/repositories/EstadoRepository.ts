import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { DatabaseRepository } from '@/core/repositories/DatabaseRepository'
import { EstadoModel } from '@/modules/locality/models/EstadoModel'

@Injectable()
export class EstadoRepository extends DatabaseRepository<EstadoModel, number> {
  public constructor(@InjectRepository(EstadoModel) repository: Repository<EstadoModel>) {
    super(repository, 'estado')
  }
}
