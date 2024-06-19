import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { ZonaRepository } from '@/emergency/repositories/ZonaRepository '
import { Localidade } from '@/locality/structures/Localidade'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { DeleteResult } from 'typeorm'

@Injectable()
export class DeleteZonaUseCase {
  constructor(
    private readonly zonaRepository: ZonaRepository,
  ) { }

  async execute(localidade: Localidade, id: number): Promise<DeleteResult> {
    const model = await this.zonaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.zona.notFound)
    }

    if (localidade.id !== model.localidadeId) {
      throw new ForbiddenException(ErrorMessages.emergency.localidade.notAllowed)
    }

    return this.zonaRepository.delete(id)
  }
}
