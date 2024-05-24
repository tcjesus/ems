import { Injectable, NotFoundException } from '@nestjs/common'

import { ZonaResponse } from '@/emergency/structures/responses/ZonaResponse'
import { UpdateZonaRequest } from '@/emergency/structures/requests/UpdateZonaRequest'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { ZonaRepository } from '@/emergency/repositories/ZonaRepository '

@Injectable()
export class UpdateZonaUseCase {
  constructor(
    private readonly zonaRepository: ZonaRepository,
  ) { }

  async execute(id: number, input: UpdateZonaRequest): Promise<ZonaResponse> {
    const model = await this.zonaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.zona.notFound)
    }

    const { nome } = input
    model.nome = nome

    const updatedModel = await this.zonaRepository.save(model)

    return ZonaResponse.toResponse(updatedModel)
  }
}
