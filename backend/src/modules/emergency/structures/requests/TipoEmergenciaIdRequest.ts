import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber } from "class-validator";

export class TipoEmergenciaIdRequest {
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'ID do Tipo de Emergẽncia', example: 1 })
  id: number
}