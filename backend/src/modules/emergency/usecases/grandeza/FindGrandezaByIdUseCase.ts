import { Injectable, NotFoundException } from '@nestjs/common'

import { GrandezaRepository } from '@/emergency/repositories/GrandezaRepository'
import { GrandezaResponse } from '@/emergency/structures/responses/GrandezaResponse'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'

@Injectable()
export class FindGrandezaByIdUseCase {
  constructor(
    private readonly grandezaRepository: GrandezaRepository,
  ) { }

  async execute(id: number): Promise<GrandezaResponse> {
    const model = await this.grandezaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.grandeza.notFound)
    }

    return GrandezaResponse.toResponse(model)
  }
}
