import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'

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
}
