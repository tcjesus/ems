import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccountModule } from '@/account/AccountModule'
import { CidadeController } from '@/locality/controllers/CidadeController'
import { CidadeRepository } from '@/locality/repositories/CidadeRepository'
import { CidadeFacade } from '@/locality/services/CidadeFacade'
import { FindCidadesByEstadoUseCase } from '@/locality/usecases/FindCidadesByEstadoUseCase'
import { CidadeModel } from '@/modules/locality/models/CidadeModel'
import { EstadoModel } from '@/modules/locality/models/EstadoModel'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EstadoModel,
      CidadeModel,
    ]),
    forwardRef(() => AccountModule),
  ],
  controllers: [
    CidadeController,
  ],
  providers: [
    // Facade
    CidadeFacade,

    // Repositories
    CidadeRepository,

    // Usecases
    FindCidadesByEstadoUseCase,
  ],
})
export class LocalityModule { }
