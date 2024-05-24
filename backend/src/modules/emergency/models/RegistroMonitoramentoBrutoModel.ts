import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { ColumnNumericTransformer } from '@/core/repositories/ColumnNumericTransformer'

@Entity('registro_monitoramento_bruto')
export class RegistroMonitoramentoBrutoModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<RegistroMonitoramentoBrutoModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'ude_id' })
  udeId: number

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
