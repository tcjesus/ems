import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber } from "class-validator";

export class SensorIdRequest {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'ID do Sensor', example: 1 })
  id: number
}