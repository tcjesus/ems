import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { CidadeModel } from '@/locality/models/CidadeModel'

@Entity('localidade')
export class LocalidadeModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<LocalidadeModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'cidade_id' })
  cidadeId: number

  @ManyToOne(() => CidadeModel, (model) => model.localidades)
  @JoinColumn({ name: 'cidade_id' })
  cidade?: CidadeModel
}
