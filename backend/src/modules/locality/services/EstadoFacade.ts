import { EstadoResponse } from '@/locality/structures/responses/EstadoResponse'
import { ListEstadosUseCase } from '@/locality/usecases/ListEstadosUseCase'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EstadoFacade {
  constructor(
    private readonly listEstadosUseCase: ListEstadosUseCase,
  ) { }

  list(): Promise<EstadoResponse[]> {
    return this.listEstadosUseCase.execute()
  }
}
