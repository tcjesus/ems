import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { DeteccaoEmergenciaModel } from '@/emergency/models/DeteccaoEmergenciaModel'
import { ZonaModel } from '@/emergency/models/ZonaModel'
import { TipoUdeEnum } from '@/emergency/structures/enum/TipoUdeEnum'
import { ColumnNumericTransformer } from '@/core/repositories/ColumnNumericTransformer'
import { LocalidadeModel } from '@/locality/models/LocalidadeModel'

@Entity('ude')
export class UdeModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<UdeModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 5 })
  tipo: TipoUdeEnum

  @Column({ length: 50 })
  label?: string

  @Column({ length: 17 })
  @Index()
  mac: string

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    transformer: new ColumnNumericTransformer()
  })
  latitude: number

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    transformer: new ColumnNumericTransformer()
  })
  longitude: number

  @Column({
    name: 'operating_range',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer()
  })
  operatingRange?: number

  @Column({ name: 'zona_id' })
  zonaId: number

  @ManyToOne(() => ZonaModel, (model) => model.id)
  @JoinColumn({ name: 'zona_id' })
  zona?: ZonaModel

  @OneToMany(() => DeteccaoEmergenciaModel, (model) => model.ude, { cascade: true })
  deteccoesEmergencia: DeteccaoEmergenciaModel[]

  @Column({ name: 'localidade_id' })
  localidadeId: number

  @ManyToOne(() => LocalidadeModel, (model) => model.id)
  @JoinColumn({ name: 'localidade_id' })
  localidade?: LocalidadeModel
}
