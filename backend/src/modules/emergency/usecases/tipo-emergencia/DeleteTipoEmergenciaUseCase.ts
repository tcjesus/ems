import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { Localidade } from '@/locality/structures/Localidade'
import { DeleteResult } from 'typeorm'

@Injectable()
export class DeleteTipoEmergenciaUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
  ) { }

  async execute(localidade: Localidade, id: number): Promise<DeleteResult> {
    const model = await this.tipoEmergenciaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.zona.notFound)
    }

    if (localidade.id !== model.localidadeId) {
      throw new ForbiddenException(ErrorMessages.emergency.localidade.notAllowed)
    }

    return this.tipoEmergenciaRepository.delete(id)
  }
}
