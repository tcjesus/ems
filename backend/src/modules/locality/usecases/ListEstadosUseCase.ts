import { Injectable } from '@nestjs/common'

import { EstadoRepository } from '@/locality/repositories/EstadoRepository'
import { EstadoResponse } from '@/locality/structures/responses/EstadoResponse'

@Injectable()
export class ListEstadosUseCase {
  constructor(
    private readonly estadoRepository: EstadoRepository,
  ) { }

  async execute(): Promise<EstadoResponse[]> {
    const models = await this.estadoRepository.findAll()

    return models.map(model => EstadoResponse.toResponse(model))
  }
}
