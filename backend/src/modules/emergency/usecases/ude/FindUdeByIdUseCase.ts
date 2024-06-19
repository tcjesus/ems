import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'
import { Localidade } from '@/locality/structures/Localidade'

@Injectable()
export class FindUdeByIdUseCase {
  constructor(
    private readonly udeRepository: UdeRepository,
  ) { }

  async execute(localidade: Localidade, id: number): Promise<UdeResponse> {
    const model = await this.udeRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.ude.notFound)
    }

    if (localidade.id !== model.localidadeId) {
      throw new ForbiddenException(ErrorMessages.emergency.localidade.notAllowed)
    }

    return UdeResponse.toResponse(model)
  }
}
