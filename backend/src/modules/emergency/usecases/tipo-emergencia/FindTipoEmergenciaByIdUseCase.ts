import { Injectable, NotFoundException } from '@nestjs/common'

import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { TipoEmergenciaResponse } from '@/emergency/structures/responses/TipoEmergenciaResponse'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'

@Injectable()
export class FindTipoEmergenciaByIdUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
  ) { }

  async execute(id: number): Promise<TipoEmergenciaResponse> {
    const model = await this.tipoEmergenciaRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.tipoEmergencia.notFound)
    }

    return TipoEmergenciaResponse.toResponse(model)
  }
}
