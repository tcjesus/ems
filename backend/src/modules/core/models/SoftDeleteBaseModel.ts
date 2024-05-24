import { DeleteDateColumn, Index } from 'typeorm'

import { BaseModel } from '@/core/models/BaseModel'

export abstract class SoftDeleteBaseModel extends BaseModel {
  @DeleteDateColumn({ name: 'deleted_at' })
  @Index()
  deletedAt?: Date
}
