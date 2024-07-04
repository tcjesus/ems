import { AccountModel } from '@/account/models/AccountModel';
import { MigrationInterface, QueryRunner } from 'typeorm';

const accounts: { nome: string; email: string; password: string, isSuperAdmin: boolean }[] = [
  {
    nome: 'Matheus Borges',
    email: 'matob@live.com',
    password: 'uefspgcc2024',
    isSuperAdmin: true,
  },
  {
    nome: 'Inácio Borges',
    email: 'inacioob@gmail.com',
    password: 'uefspgcc2024',
    isSuperAdmin: true,
  },
  {
    nome: 'Darlan Oliveira',
    email: 'darlandbo@hotmail.com',
    password: 'uefspgcc2024',
    isSuperAdmin: true,
  },
  {
    nome: 'Pedro Martins',
    email: 'pedromartins.eng@hotmail.com',
    password: 'uefspgcc2024',
    isSuperAdmin: true,
  },
  {
    nome: 'Gabriel Alves',
    email: 'gabrielalves@ecomp.uefs.br',
    password: 'uefspgcc2024',
    isSuperAdmin: true,
  },
  {
    nome: 'Thiago Jesus',
    email: 'thiagocj@gmail.com',
    password: 'uefspgcc2024',
    isSuperAdmin: true,
  },
]

export class InsertAccounts1714343577159 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const account of accounts) {
      const passwordHash = AccountModel.hashPassword(account.password)
      await queryRunner.manager.query(
        `INSERT INTO account (nome, email, password, isSuperAdmin) VALUES (?, ?, ?, ?)`,
        [account.nome, account.email, passwordHash, account.isSuperAdmin],
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const emails = accounts.map((account) => account.email)
    queryRunner.manager.query(
      `DELETE FROM account WHERE email IN (${emails.map(() => '?').join(',')})`,
      emails,
    )
  }
}
