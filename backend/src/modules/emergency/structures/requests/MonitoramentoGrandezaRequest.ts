import { GrandezaIdRequest } from "@/emergency/structures/requests/GrandezaIdRequest"
import { SensorIdRequest } from "@/emergency/structures/requests/SensorIdRequest"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsBoolean, IsDefined, IsNumber, IsOptional, ValidateNested } from "class-validator"

export class MonitoramentoGrandezaRequest {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Identificador do Monitoramento de Grandeza', example: 1 })
  id?: number

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => SensorIdRequest)
  @ApiProperty({ description: 'Sensor responsável pelo monitoramento', type: SensorIdRequest })
  sensor: SensorIdRequest

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => GrandezaIdRequest)
  @ApiProperty({ description: 'Grandeza monitorada', type: GrandezaIdRequest })
  grandeza: GrandezaIdRequest

  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @ApiProperty({ description: 'Threshold Mínimo', required: false, example: 20.0 })
  thresholdMinimo?: number

  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @ApiProperty({ description: 'Threshold Máximo', required: false, example: 60.0 })
  thresholdMaximo?: number

  @IsDefined()
  @IsNumber({ allowNaN: false })
  @ApiProperty({ description: 'Taxa de Amostragem em segundos do sensoriamento', example: 5 })
  intervaloAmostragem: number

  @IsDefined()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @ApiProperty({ description: 'Taxa de Variação para considerar um novo valor monitorado', example: 0.01 })
  taxaVariacaoMinima: number

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Indica se a detecção está ativa', example: true })
  ativo?: Boolean
}