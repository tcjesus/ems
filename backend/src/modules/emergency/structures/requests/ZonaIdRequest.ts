import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber } from "class-validator";

export class ZonaIdRequest {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'ID da Zona', example: 1 })
  id: number
}