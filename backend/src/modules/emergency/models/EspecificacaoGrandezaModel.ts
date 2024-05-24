import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'
import { SensorModel } from '@/emergency/models/SensorModel'
import { TipoSinalEnum } from '@/emergency/structures/enum/TipoSinalEnum'
import { ColumnNumericTransformer } from '@/core/repositories/ColumnNumericTransformer'

@Entity('especificacao_grandeza')
export class EspecificacaoGrandezaModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<EspecificacaoGrandezaModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'sensor_id' })
  sensorId: number

  @ManyToOne(() => SensorModel, (model) => model.especificacoes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: "delete"
  })
  @JoinColumn({ name: 'sensor_id' })
  sensor?: SensorModel

  @Column({ name: 'grandeza_id' })
  grandezaId: number

  @ManyToOne(() => GrandezaModel, (model) => model.id)
  @JoinColumn({ name: 'grandeza_id' })
  grandeza?: GrandezaModel

  @Column({
    name: 'valor_minimo',
    type: 'decimal',
    precision: 8,
    scale: 3,
    nullable: true,
    transformer: new ColumnNumericTransformer()
  })
  valorMinimo?: number

  @Column({
    name: 'valor_maximo',
    type: 'decimal',
    precision: 8,
    scale: 3,
    nullable: true,
    transformer: new ColumnNumericTransformer()
  })
  valorMaximo?: number

  @Column({ type: 'varchar', length: 15, nullable: true })
  sinal?: TipoSinalEnum
}
