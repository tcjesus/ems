import { TypeOrmModuleOptions } from '@nestjs/typeorm'

import { Environment as envs } from '@/Environment'
import { AccountModel } from '@/account/models/AccountModel'
import { AuditModel } from '@/account/models/AuditModel'
import { DeteccaoEmergenciaModel } from '@/emergency/models/DeteccaoEmergenciaModel'
import { EspecificacaoGrandezaModel } from '@/emergency/models/EspecificacaoGrandezaModel'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'
import { MonitoramentoGrandezaModel } from '@/emergency/models/MonitoramentoGrandezaModel'
import { MonitoramentoRawDataModel } from '@/emergency/models/MonitoramentoRawDataModel'
import { RegistroMonitoramentoModel } from '@/emergency/models/RegistroMonitoramentoModel'
import { SensorModel } from '@/emergency/models/SensorModel'
import { TipoEmergenciaModel } from '@/emergency/models/TipoEmergenciaModel'
import { UdeModel } from '@/emergency/models/UdeModel'
import { ZonaModel } from '@/emergency/models/ZonaModel'

import DatabaseConfig from '@/database/config/DatabaseConfig'
import { CidadeModel } from '@/locality/models/CidadeModel'
import { EstadoModel } from '@/locality/models/EstadoModel'

export default {
  ...DatabaseConfig,

  synchronize: false,
  migrationsRun: false,
  extra: {
    connectionLimit: envs.DB_CONNECTION_LIMIT,
  },
  logging: false,
  entities: [
    // Account Module
    AccountModel,
    AuditModel,

    // Emergency Module
    GrandezaModel,
    TipoEmergenciaModel,
    SensorModel,
    EspecificacaoGrandezaModel,
    ZonaModel,
    UdeModel,
    DeteccaoEmergenciaModel,
    MonitoramentoGrandezaModel,
    MonitoramentoRawDataModel,
    RegistroMonitoramentoModel,

    // Locality Module
    EstadoModel,
    CidadeModel,
  ],
  bigNumberStrings: false,
  timezone: '+00:00',
} as TypeOrmModuleOptions
