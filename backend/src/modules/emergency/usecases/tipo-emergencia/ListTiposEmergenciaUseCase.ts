import { Injectable } from '@nestjs/common'

import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { TipoEmergenciaResponse } from '@/emergency/structures/responses/TipoEmergenciaResponse'
import { Localidade } from '@/locality/structures/Localidade'

@Injectable()
export class ListTiposEmergenciaUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
  ) { }

  async execute(localidade: Localidade): Promise<TipoEmergenciaResponse[]> {
    const models = await this.tipoEmergenciaRepository.findManyBy({ localidade_id: localidade.id })

    return models.map(model => TipoEmergenciaResponse.toResponse(model))
  }
}
