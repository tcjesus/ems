import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNumber, IsOptional } from "class-validator"

export class RequestMonitoramentoDataRequest {
  @IsOptional()
  @IsNumber({ allowNaN: false })
  @ApiProperty({ description: 'Identificador do Tipo de emergência a ser requisitada', required: false, example: 1 })
  tipoEmergencia?: number

  @IsOptional()
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  @ApiProperty({ description: 'Identificadores das Grandezas a serem requisitadas', required: false, example: [1, 2, 3] })
  grandezas?: number[]

  @IsOptional()
  @IsNumber({ allowNaN: false })
  @ApiProperty({ description: 'Identificador da UDE de destino da requisição', required: false, example: 1 })
  ude?: number

  @IsOptional()
  @IsNumber({ allowNaN: false })
  @ApiProperty({ description: 'Identificador da Zona de destino da requisição', required: false, example: 1 })
  zona?: number
}
