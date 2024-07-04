import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { ZonaRepository } from '@/emergency/repositories/ZonaRepository '
import { ZonaResponse } from '@/emergency/structures/responses/ZonaResponse'
import { Localidade } from '@/locality/structures/Localidade'

@Injectable()
export class FindZonaByIdUseCase {
  constructor(
    private readonly zonaRepository: ZonaRepository,
  ) { }

  async execute(localidade: Localidade, id: number): Promise<ZonaResponse> {
    const model = await this.zonaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.zona.notFound)
    }

    if (localidade.id !== model.localidadeId) {
      throw new ForbiddenException(ErrorMessages.emergency.localidade.notAllowed)
    }

    return ZonaResponse.toResponse(model)
  }
}
