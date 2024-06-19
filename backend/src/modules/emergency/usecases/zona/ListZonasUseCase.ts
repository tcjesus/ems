import { Injectable } from '@nestjs/common'

import { ZonaRepository } from '@/emergency/repositories/ZonaRepository '
import { ZonaResponse } from '@/emergency/structures/responses/ZonaResponse'
import { Localidade } from '@/locality/structures/Localidade'

@Injectable()
export class ListZonasUseCase {
  constructor(
    private readonly zonaRepository: ZonaRepository,
  ) { }

  async execute(localidade: Localidade): Promise<ZonaResponse[]> {
    const models = await this.zonaRepository.findManyBy({ localidade_id: localidade.id })

    return models.map(model => ZonaResponse.toResponse(model))
  }
}
