import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { AuditModel } from '@/account/models/AuditModel'
import { DatabaseRepository } from '@/core/repositories/DatabaseRepository'

@Injectable()
export class AuditRepository extends DatabaseRepository<AuditModel, number> {
  public constructor(@InjectRepository(AuditModel) repository: Repository<AuditModel>) {
    super(repository, 'audit')
  }
}
