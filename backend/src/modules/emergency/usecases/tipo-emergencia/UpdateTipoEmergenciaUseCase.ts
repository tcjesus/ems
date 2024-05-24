import { Injectable, NotFoundException } from '@nestjs/common'

import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { TipoEmergenciaResponse } from '@/emergency/structures/responses/TipoEmergenciaResponse'
import { UpdateTipoEmergenciaRequest } from '@/emergency/structures/requests/UpdateTipoEmergenciaRequest'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'

@Injectable()
export class UpdateTipoEmergenciaUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
  ) { }

  async execute(id: number, input: UpdateTipoEmergenciaRequest): Promise<TipoEmergenciaResponse> {
    const model = await this.tipoEmergenciaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.tipoEmergencia.notFound)
    }

    const { nome, grandezas: grandezasIds } = input
    const grandezas = grandezasIds?.map((grandezaId) => new GrandezaModel({ id: grandezaId.id })) || []

    model.nome = nome
    model.grandezas = grandezas

    const updatedModel = await this.tipoEmergenciaRepository.save(model)

    return TipoEmergenciaResponse.toResponse(updatedModel)
  }
}
