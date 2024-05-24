import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { DatabaseRepository } from '@/core/repositories/DatabaseRepository'
import { SensorModel } from '@/emergency/models/SensorModel'

@Injectable()
export class SensorRepository extends DatabaseRepository<SensorModel, number> {
  public constructor(@InjectRepository(SensorModel) repository: Repository<SensorModel>) {
    super(repository, 'sensor', [
      { field: 'sensor.especificacoes', alias: 'e' },
      { field: 'e.grandeza' },
    ])
  }
}
