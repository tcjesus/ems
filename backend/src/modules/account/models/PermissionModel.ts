import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { AccountModel } from '@/account/models/AccountModel'
import { Role } from '@/account/structures/enum/Role'
import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { LocalidadeModel } from '@/locality/models/LocalidadeModel'

@Entity('permission')
export class PermissionModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<PermissionModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'account_id' })
  accountId: number

  @ManyToOne(() => AccountModel, (model) => model.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: "delete"
  })
  @JoinColumn({ name: 'account_id' })
  account?: AccountModel

  @Column({ name: 'localidade_id' })
  localidadeId: number

  @ManyToOne(() => LocalidadeModel, (model) => model.id)
  @JoinColumn({ name: 'localidade_id' })
  localidade?: LocalidadeModel

  @Column({ type: 'varchar', length: 15 })
  role: Role
}
