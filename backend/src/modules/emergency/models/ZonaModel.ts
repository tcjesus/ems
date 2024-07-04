import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { LocalidadeModel } from '@/locality/models/LocalidadeModel'

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

  @Column({ name: 'localidade_id' })
  localidadeId: number

  @ManyToOne(() => LocalidadeModel, (model) => model.id)
  @JoinColumn({ name: 'localidade_id' })
  localidade?: LocalidadeModel
}
