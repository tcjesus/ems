import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { Environment as envs } from '@/Environment'
import { HealthCheckResponse } from '@/health-check/structures/responses/HealthCheckResponse'

@Controller('healthcheck')
@ApiTags('healthcheck')
export class HealthCheckController {
  @Get()
  @ApiOperation({ summary: 'Get health of service' })
  @ApiOkResponse({ type: HealthCheckResponse })
  check (): HealthCheckResponse {
    return {
      status: 'OK',
      env: envs.NODE_ENV,
      date: new Date(),
    }
  }
}
