/* eslint-disable import/first */
/* eslint-disable import-helpers/order-imports */
import dotenv from 'dotenv'
dotenv.config()

import { join } from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'

import DatabaseConfig from '@/database/config/DatabaseConfig'
import TypeOrmConfig from '@/database/config/TypeOrmConfig'

export default new DataSource({
  ...(TypeOrmConfig as DataSourceOptions),
  migrationsTableName: 'Seed',
  migrations: [
    join(__dirname, '..', 'seedsDev', DatabaseConfig.type, '*{.ts,.js}')
  ],
})
