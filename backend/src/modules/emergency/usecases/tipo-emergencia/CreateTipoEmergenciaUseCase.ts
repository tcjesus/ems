import { Injectable } from '@nestjs/common'

import { TipoEmergenciaModel } from '@/emergency/models/TipoEmergenciaModel'
import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { CreateTipoEmergenciaRequest } from '@/emergency/structures/requests/CreateTipoEmergenciaRequest'
import { TipoEmergenciaResponse } from '@/emergency/structures/responses/TipoEmergenciaResponse'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'

@Injectable()
export class CreateTipoEmergenciaUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
  ) { }

  async execute(input: CreateTipoEmergenciaRequest): Promise<TipoEmergenciaResponse> {
    const { nome, grandezas: grandezasIds } = input

    const grandezas = grandezasIds?.map((grandezaId) => new GrandezaModel({ id: grandezaId.id })) || []

    const model = new TipoEmergenciaModel({
      nome,
      grandezas,
    })

    const createdModel = await this.tipoEmergenciaRepository.save(model)

    return TipoEmergenciaResponse.toResponse(createdModel)
  }
}
