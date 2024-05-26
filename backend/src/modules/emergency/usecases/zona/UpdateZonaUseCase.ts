import { Injectable, NotFoundException } from '@nestjs/common'

import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { ZonaRepository } from '@/emergency/repositories/ZonaRepository '
import { UpdateZonaRequest } from '@/emergency/structures/requests/UpdateZonaRequest'
import { ZonaResponse } from '@/emergency/structures/responses/ZonaResponse'

@Injectable()
export class UpdateZonaUseCase {
  constructor(
    private readonly zonaRepository: ZonaRepository,
  ) { }

  async execute(id: number, { nome }: UpdateZonaRequest): Promise<ZonaResponse> {
    const model = await this.zonaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.zona.notFound)
    }

    model.nome = nome

    const updatedModel = await this.zonaRepository.save(model)

    return ZonaResponse.toResponse(updatedModel)
  }
}
