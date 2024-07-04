import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { DeleteResult } from 'typeorm'
import { Localidade } from '@/locality/structures/Localidade'

@Injectable()
export class DeleteUdeUseCase {
  constructor(
    private readonly udeRepository: UdeRepository,
  ) { }

  async execute(localidade: Localidade, id: number): Promise<DeleteResult> {
    const model = await this.udeRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.zona.notFound)
    }

    if (localidade.id !== model.localidadeId) {
      throw new ForbiddenException(ErrorMessages.emergency.localidade.notAllowed)
    }

    return this.udeRepository.delete(id)
  }
}
