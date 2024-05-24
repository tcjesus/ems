import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber } from "class-validator";

export class GrandezaIdRequest {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'ID da Grandeza', example: 1 })
  id: number
}