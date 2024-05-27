import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { ColumnNumericTransformer } from '@/core/repositories/ColumnNumericTransformer'
import { UdeModel } from '@/emergency/models/UdeModel'

@Entity('monitoramento_raw_data')
export class MonitoramentoRawDataModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<MonitoramentoRawDataModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'ude_id' })
  udeId: number

  @ManyToOne(() => UdeModel, (model) => model.id)
  @JoinColumn({ name: 'ude_id' })
  ude?: UdeModel

  @Column()
  sensor: string

  @Column()
  grandeza: string

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  valor: number

  @Column({ name: 'data_inicial' })
  dataInicial: Date

  @Column({ name: 'data_final' })
  dataFinal: Date
}
