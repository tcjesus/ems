import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { TipoEmergenciaModel } from '@/emergency/models/TipoEmergenciaModel'
import { MonitoramentoGrandezaModel } from '@/emergency/models/MonitoramentoGrandezaModel'
import { UdeModel } from '@/emergency/models/UdeModel'

@Entity('deteccao_emergencia')
export class DeteccaoEmergenciaModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<DeteccaoEmergenciaModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'ude_id' })
  udeId: number

  @ManyToOne(() => UdeModel, (model) => model.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: "delete"
  })
  @JoinColumn({ name: 'ude_id' })
  ude?: UdeModel

  @Column({ name: 'tipo_emergencia_id' })
  tipoEmergenciaId: number

  @ManyToOne(() => TipoEmergenciaModel, (model) => model.id)
  @JoinColumn({ name: 'tipo_emergencia_id' })
  tipoEmergencia?: TipoEmergenciaModel

  @OneToMany(() => MonitoramentoGrandezaModel, (model) => model.deteccaoEmergencia, { cascade: true })
  monitoramentosGrandeza: MonitoramentoGrandezaModel[]
}
