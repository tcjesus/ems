import { Injectable } from '@nestjs/common'

import { GrandezaModel } from '@/emergency/models/GrandezaModel'
import { GrandezaRepository } from '@/emergency/repositories/GrandezaRepository'
import { CreateGrandezaRequest } from '@/emergency/structures/requests/CreateGrandezaRequest'
import { GrandezaResponse } from '@/emergency/structures/responses/GrandezaResponse'

@Injectable()
export class CreateGrandezaUseCase {
  constructor(
    private readonly grandezaRepository: GrandezaRepository,
  ) { }

  async execute({ nome, unidadeMedida, sigla }: CreateGrandezaRequest): Promise<GrandezaResponse> {
    const model = new GrandezaModel({
      nome,
      unidadeMedida,
      sigla,
    })

    const createdModel = await this.grandezaRepository.save(model)

    return GrandezaResponse.toResponse(createdModel)
  }
}
