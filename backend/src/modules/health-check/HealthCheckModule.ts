import { Module } from '@nestjs/common'

import { HealthCheckController } from '@/health-check/controllers/HealthCheckController'

@Module({
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
