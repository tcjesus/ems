import { CidadeResponse } from '@/locality/structures/responses/CidadeResponse'
import { FindCidadesByEstadoUseCase } from '@/locality/usecases/FindCidadesByEstadoUseCase'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CidadeFacade {
  constructor(
    private readonly findCidadesByEstadoUseCase: FindCidadesByEstadoUseCase,
  ) { }

  findByEstado(siglaEstado: string): Promise<CidadeResponse[]> {
    return this.findCidadesByEstadoUseCase.execute(siglaEstado)
  }
}
