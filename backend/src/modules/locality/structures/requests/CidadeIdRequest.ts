import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber } from "class-validator";

export class CidadeIdRequest {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'ID da Cidade', example: 1 })
  id: number
}