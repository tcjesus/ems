import { Injectable, NotFoundException } from '@nestjs/common'

import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { GrandezaRepository } from '@/emergency/repositories/GrandezaRepository'
import { UpdateGrandezaRequest } from '@/emergency/structures/requests/UpdateGrandezaRequest'
import { GrandezaResponse } from '@/emergency/structures/responses/GrandezaResponse'

@Injectable()
export class UpdateGrandezaUseCase {
  constructor(
    private readonly grandezaRepository: GrandezaRepository,
  ) { }

  async execute(
    id: number,
    { nome, unidadeMedida, sigla }: UpdateGrandezaRequest
  ): Promise<GrandezaResponse> {
    const model = await this.grandezaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.grandeza.notFound)
    }

    model.nome = nome
    model.unidadeMedida = unidadeMedida
    model.sigla = sigla

    const updatedModel = await this.grandezaRepository.save(model)

    return GrandezaResponse.toResponse(updatedModel)
  }
}
