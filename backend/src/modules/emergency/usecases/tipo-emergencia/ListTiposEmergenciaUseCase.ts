import { Injectable } from '@nestjs/common'

import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { TipoEmergenciaResponse } from '@/emergency/structures/responses/TipoEmergenciaResponse'

@Injectable()
export class ListTiposEmergenciaUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
  ) { }

  async execute(): Promise<TipoEmergenciaResponse[]> {
    const models = await this.tipoEmergenciaRepository.findAll()

    return models.map(model => TipoEmergenciaResponse.toResponse(model))
  }
}
