import { EspecificacaoGrandezaRequest } from '@/emergency/structures/requests/EspecificacaoGrandezaRequest'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

import { IsArray, IsDefined, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator'

export class CreateSensorRequest {
  @IsDefined()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'Modelo do Sensor', maxLength: 50, example: 'CM18-2008A' })
  modelo: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Descrição do Sensor',
    required: false,
    maxLength: 255,
    example: 'Sensor Com Cabo Capacitivo CM18-2008A não faceado 18mm 90-250Vca (NA) C/ 2 Fios e Range 8mm'
  })
  descricao?: string

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EspecificacaoGrandezaRequest)
  @ApiProperty({
    description: 'Lista de Especificações de Grandeza associadas ao Sensor',
    type: [EspecificacaoGrandezaRequest],
  })
  especificacoes: EspecificacaoGrandezaRequest[]
}
