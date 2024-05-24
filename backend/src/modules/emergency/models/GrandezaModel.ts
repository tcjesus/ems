import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { TipoEmergenciaModel } from '@/emergency/models/TipoEmergenciaModel'

@Entity('grandeza')
export class GrandezaModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<GrandezaModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  nome: string

  @Column({
    nullable: true,
    length: 50,
    name: 'unidade_medida',
  })
  unidadeMedida?: string

  @Column({
    nullable: true,
    length: 20,
  })
  sigla?: string

  @ManyToMany(() => TipoEmergenciaModel, (model) => model.grandezas)
  tiposEmergencia: TipoEmergenciaModel[]
}
