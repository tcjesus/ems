import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { AccountModel } from '@/account/models/AccountModel';
import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel';

@Entity('audit')
export class AuditModel extends SoftDeleteBaseModel {
  constructor(params?: Partial<AuditModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'account_id' })
  @Index('IDX_audit_account')
  accountId: number

  @ManyToOne(() => AccountModel, (model) => model.id)
  @JoinColumn({ name: 'account_id' })
  account?: AccountModel

  @Column({ length: 6 })
  @Index('IDX_audit_method')
  method: string

  @Column({ length: 100 })
  @Index('IDX_audit_resource')
  resource: string

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  query?: string

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  params?: string

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  request?: string

  @Column({
    type: 'text',
    name: 'old_record',
    nullable: true,
    default: null,
  })
  oldRecord?: string

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  response?: string

  beforeSave() {
    if (this.id === undefined) {
      this.id = uuidv4()
    }
  }
}
