import { Injectable } from '@nestjs/common'

import { GrandezaModel } from '@/emergency/models/GrandezaModel'
import { TipoEmergenciaModel } from '@/emergency/models/TipoEmergenciaModel'
import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { CreateTipoEmergenciaRequest } from '@/emergency/structures/requests/CreateTipoEmergenciaRequest'
import { TipoEmergenciaResponse } from '@/emergency/structures/responses/TipoEmergenciaResponse'
import { Localidade } from '@/locality/structures/Localidade'

@Injectable()
export class CreateTipoEmergenciaUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
  ) { }

  async execute(
    localidade: Localidade,
    { nome, grandezas: grandezasIds }: CreateTipoEmergenciaRequest
  ): Promise<TipoEmergenciaResponse> {
    const grandezas = grandezasIds?.map((grandezaId) => new GrandezaModel({ id: grandezaId.id })) || []

    const model = new TipoEmergenciaModel({
      nome,
      grandezas,
      localidadeId: localidade.id,
    })

    const createdModel = await this.tipoEmergenciaRepository.save(model)

    return TipoEmergenciaResponse.toResponse(createdModel)
  }
}
