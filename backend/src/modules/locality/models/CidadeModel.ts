import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { LocalidadeModel } from '@/locality/models/LocalidadeModel'
import { EstadoModel } from '@/modules/locality/models/EstadoModel'

@Entity('cidade')
export class CidadeModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<CidadeModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'codigo_ibge', length: 15 })
  codigoIbge: string

  @Column({ length: 50 })
  nome: string

  @Column({ name: 'estado_id' })
  estadoId: number

  @ManyToOne(() => EstadoModel, (model) => model.cidades)
  @JoinColumn({ name: 'estado_id' })
  estado?: EstadoModel

  @OneToMany(() => LocalidadeModel, (model) => model.cidade)
  localidades?: LocalidadeModel[]
}
