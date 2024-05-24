import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { DatabaseRepository } from '@/core/repositories/DatabaseRepository'
import { RegistroMonitoramentoBrutoModel } from '@/emergency/models/RegistroMonitoramentoBrutoModel'

@Injectable()
export class RegistroMonitoramentoBrutoRepository extends DatabaseRepository<RegistroMonitoramentoBrutoModel, number> {
  public constructor(@InjectRepository(RegistroMonitoramentoBrutoModel) repository: Repository<RegistroMonitoramentoBrutoModel>) {
    super(repository, 'registro_monitoramento_bruto')
  }
}
