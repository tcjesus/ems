import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { TipoEmergenciaResponse } from '@/emergency/structures/responses/TipoEmergenciaResponse'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { Localidade } from '@/locality/structures/Localidade'

@Injectable()
export class FindTipoEmergenciaByIdUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
  ) { }

  async execute(localidade: Localidade, id: number): Promise<TipoEmergenciaResponse> {
    const model = await this.tipoEmergenciaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.tipoEmergencia.notFound)
    }

    if (localidade.id !== model.localidadeId) {
      throw new ForbiddenException(ErrorMessages.emergency.localidade.notAllowed)
    }

    return TipoEmergenciaResponse.toResponse(model)
  }
}
