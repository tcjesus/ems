import { Role } from '@/account/structures/enum/Role'
import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsString, MaxLength } from 'class-validator'

export class CreateAccountRequest {
  @IsDefined()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: 'Nome do Usuário', maxLength: 100, example: 'Matheus Borges' })
  nome: string

  @IsDefined()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: 'Email do Usuário', maxLength: 100, example: 'matob@live.com' })
  email: string

  @IsDefined()
  @IsString()
  @MaxLength(256)
  @ApiProperty({ description: 'Senha do Usuário', maxLength: 64, example: '123456' })
  password: string

  @IsDefined()
  @IsString()
  @MaxLength(15)
  @ApiProperty({ description: 'Role de Usuário', maxLength: 15, example: 'ADMIN' })
  role: Role
}
