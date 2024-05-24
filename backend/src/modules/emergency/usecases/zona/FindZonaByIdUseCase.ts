import { Injectable, NotFoundException } from '@nestjs/common'

import { ZonaResponse } from '@/emergency/structures/responses/ZonaResponse'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { ZonaRepository } from '@/emergency/repositories/ZonaRepository '

@Injectable()
export class FindZonaByIdUseCase {
  constructor(
    private readonly zonaRepository: ZonaRepository,
  ) { }

  async execute(id: number): Promise<ZonaResponse> {
    const model = await this.zonaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.zona.notFound)
    }

    return ZonaResponse.toResponse(model)
  }
}
