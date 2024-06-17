import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { CidadeModel } from '@/modules/locality/models/CidadeModel'

@Entity('estado')
export class EstadoModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<EstadoModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  nome: string

  @Column({ length: 2 })
  sigla: string

  @OneToMany(() => CidadeModel, (model) => model.estado, { cascade: true })
  cidades?: CidadeModel[]
}
