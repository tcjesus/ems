import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { DatabaseRepository } from '@/core/repositories/DatabaseRepository'
import { TipoEmergenciaModel } from '@/emergency/models/TipoEmergenciaModel'

@Injectable()
export class TipoEmergenciaRepository extends DatabaseRepository<TipoEmergenciaModel, number> {
  public constructor(@InjectRepository(TipoEmergenciaModel) repository: Repository<TipoEmergenciaModel>) {
    super(repository, 'tipo_emergencia', ['grandezas'])
  }
}
