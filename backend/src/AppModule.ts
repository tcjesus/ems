import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DataSource } from 'typeorm'
import { addTransactionalDataSource } from 'typeorm-transactional'

import { AccountModule } from '@/account/AccountModule'
import { AuthModule } from '@/auth/AuthModule'
import { JwtOptions } from '@/auth/config/JwtOptions'
import TypeOrmConfig from '@/database/config/TypeOrmConfig'
import { HealthCheckModule } from '@/health-check/HealthCheckModule'
import { EmergencyModule } from '@/emergency/EmergencyModule'
import { LocalityModule } from '@/locality/LocalityModule'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory () {
        return TypeOrmConfig
      },
      async dataSourceFactory (options) {
        if (!options) {
          throw new Error('Invalid options passed')
        }

        return addTransactionalDataSource(new DataSource(options))
      },
    }),

    AuthModule.registerRole(JwtOptions),

    HealthCheckModule,
    AccountModule,
    EmergencyModule,
    LocalityModule,
  ],
  providers: [],
})
export class AppModule {}
