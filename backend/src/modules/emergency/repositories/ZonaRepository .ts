import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { DatabaseRepository } from '@/core/repositories/DatabaseRepository'
import { ZonaModel } from '@/emergency/models/ZonaModel'

@Injectable()
export class ZonaRepository extends DatabaseRepository<ZonaModel, number> {
  public constructor(@InjectRepository(ZonaModel) repository: Repository<ZonaModel>) {
    super(repository, 'zona')
  }
}
