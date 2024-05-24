import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber } from "class-validator";

export class UdeIdRequest {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'ID da UDE', example: 1 })
  id: number
}