import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'

@Entity('zona')
export class ZonaModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<ZonaModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  nome: string
}
