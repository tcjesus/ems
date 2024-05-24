import { Injectable, NotFoundException } from '@nestjs/common'

import { GrandezaRepository } from '@/emergency/repositories/GrandezaRepository'
import { GrandezaResponse } from '@/emergency/structures/responses/GrandezaResponse'
import { UpdateGrandezaRequest } from '@/emergency/structures/requests/UpdateGrandezaRequest'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'

@Injectable()
export class UpdateGrandezaUseCase {
  constructor(
    private readonly grandezaRepository: GrandezaRepository,
  ) { }

  async execute(id: number, input: UpdateGrandezaRequest): Promise<GrandezaResponse> {
    const model = await this.grandezaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.grandeza.notFound)
    }

    const { nome, unidadeMedida, sigla } = input
    model.nome = nome
    model.unidadeMedida = unidadeMedida
    model.sigla = sigla

    const updatedModel = await this.grandezaRepository.save(model)

    return GrandezaResponse.toResponse(updatedModel)
  }
}
