import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'
import { LocalidadeModel } from '@/locality/models/LocalidadeModel'

@Entity('tipo_emergencia')
export class TipoEmergenciaModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<TipoEmergenciaModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  nome: string

  @ManyToMany(() => GrandezaModel, (model) => model.tiposEmergencia)
  @JoinTable({
    name: 'tipo_emergencia_x_grandeza',
    joinColumn: { name: 'tipo_emergencia_id' },
    inverseJoinColumn: { name: 'grandeza_id' }
  })
  grandezas: GrandezaModel[]

  @Column({ name: 'localidade_id' })
  localidadeId: number

  @ManyToOne(() => LocalidadeModel, (model) => model.id)
  @JoinColumn({ name: 'localidade_id' })
  localidade?: LocalidadeModel
}
