import { Injectable } from '@nestjs/common'

import { ZonaResponse } from '@/emergency/structures/responses/ZonaResponse'
import { ZonaRepository } from '@/emergency/repositories/ZonaRepository '

@Injectable()
export class ListZonasUseCase {
  constructor(
    private readonly zonaRepository: ZonaRepository,
  ) { }

  async execute(): Promise<ZonaResponse[]> {
    const models = await this.zonaRepository.findAll()

    return models.map(model => ZonaResponse.toResponse(model))
  }
}
