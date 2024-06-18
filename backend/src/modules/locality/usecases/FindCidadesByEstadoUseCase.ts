import { Injectable } from '@nestjs/common'

import { CidadeResponse } from '@/locality/structures/responses/CidadeResponse'
import { CidadeRepository } from '@/modules/locality/repositories/CidadeRepository'

@Injectable()
export class FindCidadesByEstadoUseCase {
  constructor(
    private readonly cidadeRepository: CidadeRepository,
  ) { }

  async execute(siglaEstado: string): Promise<CidadeResponse[]> {
    const models = await this.cidadeRepository.findBySiglaEstado(siglaEstado)

    return models.map(model => CidadeResponse.toResponse(model))
  }
}
