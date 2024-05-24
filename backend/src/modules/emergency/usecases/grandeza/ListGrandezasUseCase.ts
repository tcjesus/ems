import { Injectable } from '@nestjs/common'

import { GrandezaRepository } from '@/emergency/repositories/GrandezaRepository'
import { GrandezaResponse } from '@/emergency/structures/responses/GrandezaResponse'

@Injectable()
export class ListGrandezasUseCase {
  constructor(
    private readonly grandezaRepository: GrandezaRepository,
  ) { }

  async execute(): Promise<GrandezaResponse[]> {
    const models = await this.grandezaRepository.findAll()

    return models.map(model => GrandezaResponse.toResponse(model))
  }
}
