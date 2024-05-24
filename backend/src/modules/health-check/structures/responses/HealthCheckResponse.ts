import { ApiProperty } from '@nestjs/swagger'

export class HealthCheckResponse {
  @ApiProperty({ description: 'Service status', example: 'OK' })
  status: string

  @ApiProperty({
    description: 'Service Environment',
    example: 'development',
    examples: ['development', 'homolog', 'production'],
  })
  env: string

  @ApiProperty({ description: 'Current timestamp', example: '2023-02-02T12:46:00.623Z' })
  date: Date
}
