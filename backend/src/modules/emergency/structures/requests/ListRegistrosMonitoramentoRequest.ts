import { GrandezaIdRequest } from "@/emergency/structures/requests/GrandezaIdRequest"
import { TipoEmergenciaIdRequest } from "@/emergency/structures/requests/TipoEmergenciaIdRequest"
import { UdeIdRequest } from "@/emergency/structures/requests/UdeIdRequest"
import { ZonaIdRequest } from "@/emergency/structures/requests/ZonaIdRequest"
import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsOptional } from "class-validator"

export class ListRegistrosMonitoramentoRequest {
  @IsOptional()
  @ApiProperty({ description: 'Identificador da Zona que originou o registro', required: false, example: 1 })
  zona?: ZonaIdRequest

  @IsOptional()
  @ApiProperty({ description: 'Identificador do Tipo de emergência relacionada à Grandeza do registro', required: false, example: 1 })
  tipoEmergencia?: TipoEmergenciaIdRequest

  @IsOptional()
  @ApiProperty({ description: 'Identificador da UDE que originou o registro', required: false, example: 1 })
  ude?: UdeIdRequest

  @IsOptional()
  @IsArray()
  @ApiProperty({ description: 'Identificadores das Grandezas do registro', required: false, type: [GrandezaIdRequest] })
  grandezas?: GrandezaIdRequest[]

  @IsOptional()
  @ApiProperty({ description: 'Data inicial da coleta de dados', required: false, example: '2024-01-01T00:00:00.000Z' })
  dataInicial?: Date

  @IsOptional()
  @ApiProperty({ description: 'Data final da coleta de dados', required: false, example: '2024-12-31T00:00:00.000Z' })
  dataFinal?: Date
}
