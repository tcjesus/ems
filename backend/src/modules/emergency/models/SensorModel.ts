import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { EspecificacaoGrandezaModel } from '@/emergency/models/EspecificacaoGrandezaModel'

@Entity('sensor')
export class SensorModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<SensorModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  modelo: string

  @Column({ length: 255, nullable: true })
  descricao?: string

  @OneToMany(() => EspecificacaoGrandezaModel, (model) => model.sensor, { cascade: true })
  especificacoes?: EspecificacaoGrandezaModel[]
}
