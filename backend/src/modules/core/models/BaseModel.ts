import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class BaseModel {
  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt?: Date
}
