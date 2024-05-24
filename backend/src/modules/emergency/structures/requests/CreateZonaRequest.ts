import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsString, MaxLength } from 'class-validator'

export class CreateZonaRequest {
  @IsDefined()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'Nome da Grandeza', maxLength: 50, example: 'Zona 1' })
  nome: string
}
