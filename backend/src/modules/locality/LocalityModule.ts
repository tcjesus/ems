import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccountModule } from '@/account/AccountModule'
import { CidadeController } from '@/locality/controllers/CidadeController'
import { EstadoController } from '@/locality/controllers/EstadoController'
import { LocalidadeController } from '@/locality/controllers/LocalidadeController'
import { LocalidadeModel } from '@/locality/models/LocalidadeModel'
import { CidadeRepository } from '@/locality/repositories/CidadeRepository'
import { EstadoRepository } from '@/locality/repositories/EstadoRepository'
import { LocalidadeRepository } from '@/locality/repositories/LocalidadeRepository'
import { CidadeFacade } from '@/locality/services/CidadeFacade'
import { EstadoFacade } from '@/locality/services/EstadoFacade'
import { LocalidadeFacade } from '@/locality/services/LocalidadeFacade'
import { CreateLocalidadeIfNotExistsUseCase } from '@/locality/usecases/CreateLocalidadeIfNotExistsUseCase'
import { FindCidadesByEstadoUseCase } from '@/locality/usecases/FindCidadesByEstadoUseCase'
import { ListEstadosUseCase } from '@/locality/usecases/ListEstadosUseCase'
import { ListLocalidadesUseCase } from '@/locality/usecases/ListLocalidadesUseCase'
import { CidadeModel } from '@/modules/locality/models/CidadeModel'
import { EstadoModel } from '@/modules/locality/models/EstadoModel'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EstadoModel,
      CidadeModel,
      LocalidadeModel,
    ]),
    forwardRef(() => AccountModule),
  ],
  controllers: [
    CidadeController,
    EstadoController,
    LocalidadeController,
  ],
  providers: [
    // Facade
    CidadeFacade,
    EstadoFacade,
    LocalidadeFacade,

    // Repositories
    CidadeRepository,
    EstadoRepository,
    LocalidadeRepository,

    // Usecases
    FindCidadesByEstadoUseCase,
    CreateLocalidadeIfNotExistsUseCase,
    ListEstadosUseCase,
    ListLocalidadesUseCase,
  ],
  exports: [
    LocalidadeFacade,
    CreateLocalidadeIfNotExistsUseCase,
  ],
})
export class LocalityModule { }
