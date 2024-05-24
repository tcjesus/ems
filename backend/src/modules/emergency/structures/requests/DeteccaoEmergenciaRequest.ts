import { MonitoramentoGrandezaRequest } from "@/emergency/structures/requests/MonitoramentoGrandezaRequest"
import { TipoEmergenciaIdRequest } from "@/emergency/structures/requests/TipoEmergenciaIdRequest"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsDefined, IsNumber, IsOptional, ValidateNested } from "class-validator"

export class DeteccaoEmergenciaRequest {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Identificador da Detecção de Emergência', example: 1 })
  id?: number

  @IsDefined()
  @ValidateNested()
  @Type(() => TipoEmergenciaIdRequest)
  @ApiProperty({ description: 'Tipo de Emergência monitorada', type: TipoEmergenciaIdRequest })
  tipoEmergencia: TipoEmergenciaIdRequest

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonitoramentoGrandezaRequest)
  @ApiProperty({ description: 'Monitoramentos de Grandeza', type: [MonitoramentoGrandezaRequest] })
  monitoramentos: MonitoramentoGrandezaRequest[]
}