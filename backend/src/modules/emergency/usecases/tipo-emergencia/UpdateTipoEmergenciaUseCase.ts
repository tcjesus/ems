import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'
import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { UpdateTipoEmergenciaRequest } from '@/emergency/structures/requests/UpdateTipoEmergenciaRequest'
import { TipoEmergenciaResponse } from '@/emergency/structures/responses/TipoEmergenciaResponse'
import { Localidade } from '@/locality/structures/Localidade'

@Injectable()
export class UpdateTipoEmergenciaUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
  ) { }

  async execute(
    localidade: Localidade,
    id: number,
    { nome, grandezas: grandezasIds }: UpdateTipoEmergenciaRequest

  ): Promise<TipoEmergenciaResponse> {
    const model = await this.tipoEmergenciaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.tipoEmergencia.notFound)
    }

    if (localidade.id !== model.localidadeId) {
      throw new ForbiddenException(ErrorMessages.emergency.localidade.notAllowed)
    }

    const grandezas = grandezasIds?.map((grandezaId) => new GrandezaModel({ id: grandezaId.id })) || []

    model.nome = nome
    model.grandezas = grandezas

    const updatedModel = await this.tipoEmergenciaRepository.save(model)

    return TipoEmergenciaResponse.toResponse(updatedModel)
  }
}
