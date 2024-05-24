import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsString } from 'class-validator'

export class SignInRequest {
  @IsDefined()
  @IsString()
  @ApiProperty({ description: 'Email do usuário', example: 'matob@live.com' })
  email: string

  @IsDefined()
  @IsString()
  @ApiProperty({ description: 'Senha do usuário', example: '123456' })
  password: string
}
