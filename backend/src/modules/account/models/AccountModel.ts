import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { SoftDeleteBaseModel } from '@/core/models/SoftDeleteBaseModel'
import { PermissionModel } from '@/account/models/PermissionModel'

@Entity('account')
export class AccountModel extends SoftDeleteBaseModel {
  constructor (params?: Partial<AccountModel>) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: true,
    length: 100,
  })
  nome: string

  @Column({
    type: String,
    nullable: true,
    default: null,
    length: 100,
  })
  @Index('IDX_account_email', { unique: true })
  email: string

  @Column({ length: 255, nullable: true })
  password: string

  @Column({ type: 'boolean', default: false })
  isSuperAdmin: boolean

  @OneToMany(() => PermissionModel, (model) => model.account, { cascade: true })
  permissions: PermissionModel[]

  @BeforeInsert()
  @BeforeUpdate()
  beforeSave() {
    if (this.password) {
      this.password = AccountModel.hashPassword(this.password)
    }
  }

  checkPassword(plainPassword: string): boolean {
    return AccountModel.checkPassword(plainPassword, this.password)
  }

  static hashPassword(plainPassword: string): string {
    const bcrypt = require('bcryptjs');
    const saltRounds = 13;

    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(plainPassword, salt);
  }

  static checkPassword(plainPassword: string, storedPassword: string): boolean {
    const bcrypt = require('bcryptjs');
    return bcrypt.compareSync(plainPassword, storedPassword);
  }
}
