import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsDate, IsDefined, IsNumber, IsOptional } from "class-validator"

export class MonitoramentoSummaryRequest {
  @IsDefined()
  @IsDate()
  @ApiProperty({
    description: 'Data inicial do intervalo de monitoramento',
    example: '2024-05-01T00:00:00.000Z'
  })
  dataInicial: Date

  @IsOptional()
  @IsDate()
  @ApiProperty({
    description: 'Data final do intervalo de monitoramento',
    required: false,
    example: '2024-05-01T00:00:00.000Z'
  })
  dataFinal?: Date

  @IsOptional()
  @IsNumber({ allowNaN: false })
  @ApiProperty({
    description: 'Intervalo de monitoramento em minutos',
    required: false,
    example: 5
  })
  intervalo?: number

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
  @ApiProperty({ description: 'Identificador da Zona de destino da requisição', required: false, example: 1 })
  zona?: number

  @IsOptional()
  @IsNumber({ allowNaN: false })
  @ApiProperty({ description: 'Identificador da UDE de destino da requisição', required: false, example: 1 })
  ude?: number
}
