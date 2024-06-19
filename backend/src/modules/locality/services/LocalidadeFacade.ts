import { Account } from '@/auth/interfaces/AuthPayload'
import { LocalidadeModel } from '@/locality/models/LocalidadeModel'
import { Localidade } from '@/locality/structures/Localidade'
import { LocalidadeResponse } from '@/locality/structures/responses/LocalidadeResponse'
import { CreateLocalidadeIfNotExistsUseCase } from '@/locality/usecases/CreateLocalidadeIfNotExistsUseCase'
import { ListLocalidadesUseCase } from '@/locality/usecases/ListLocalidadesUseCase'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LocalidadeFacade {
  constructor(
    private readonly listLocalidadesUseCase: ListLocalidadesUseCase,
    private readonly createLocalidadeIfNotExistsUseCase: CreateLocalidadeIfNotExistsUseCase,
  ) { }

  list(account: Account): Promise<LocalidadeResponse[]> {
    return this.listLocalidadesUseCase.execute(account)
  }

  createIfNotExists(localidade: Localidade): Promise<LocalidadeModel> {
    return this.createLocalidadeIfNotExistsUseCase.execute(localidade)
  }
}
