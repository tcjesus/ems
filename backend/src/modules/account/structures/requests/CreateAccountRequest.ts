import { Role } from '@/account/structures/enum/Role'
import { CidadeIdRequest } from '@/locality/structures/requests/CidadeIdRequest'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

import { IsArray, IsBoolean, IsDefined, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator'

export class PermissionRequest {
  @IsDefined()
  @IsString()
  @MaxLength(15)
  @ApiProperty({ description: 'Role de Usuário', maxLength: 15, example: Role.ADMIN })
  role: Role

  @IsDefined()
  @ValidateNested()
  @Type(() => CidadeIdRequest)
  @ApiProperty({
    description: 'Cidade',
    type: CidadeIdRequest,
  })
  cidade: CidadeIdRequest
}

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

  @IsOptional()
  @ApiProperty({ description: 'É Super Admin', required: false, example: false })
  @IsBoolean()
  isSuperAdmin?: boolean

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionRequest)
  @ApiProperty({ description: 'Permissões', type: [PermissionRequest], required: false })
  permissions: PermissionRequest[]
}
