import { TipoSinalEnum } from "@/emergency/structures/enum/TipoSinalEnum"
import { GrandezaIdRequest } from "@/emergency/structures/requests/GrandezaIdRequest"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDefined, IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator"

export class EspecificacaoGrandezaRequest {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Identificador da Especificação de Grandeza', example: 1 })
  id?: number

  @IsDefined()
  @ValidateNested()
  @Type(() => GrandezaIdRequest)
  @ApiProperty({
    description: 'Grandeza especificada',
    type: GrandezaIdRequest,
  })
  grandeza: GrandezaIdRequest

  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @ApiProperty({ description: 'Valor Mínimo', required: false, example: 0.0 })
  valorMinimo?: number

  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @ApiProperty({ description: 'Valor Máximo', required: false, example: 100.0 })
  valorMaximo?: number

  @IsOptional()
  @IsEnum(TipoSinalEnum)
  @ApiProperty({ description: 'Tipo de Sinal', enum: TipoSinalEnum, required: false, example: 'DIGITAL' })
  sinal?: TipoSinalEnum
}