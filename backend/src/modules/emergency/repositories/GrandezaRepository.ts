import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { DatabaseRepository } from '@/core/repositories/DatabaseRepository'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'

@Injectable()
export class GrandezaRepository extends DatabaseRepository<GrandezaModel, number> {
  public constructor(@InjectRepository(GrandezaModel) repository: Repository<GrandezaModel>) {
    super(repository, 'grandeza')
  }
}
