import { Injectable } from '@nestjs/common'

import { ZonaModel } from '@/emergency/models/ZonaModel'
import { ZonaRepository } from '@/emergency/repositories/ZonaRepository '
import { CreateZonaRequest } from '@/emergency/structures/requests/CreateZonaRequest'
import { ZonaResponse } from '@/emergency/structures/responses/ZonaResponse'

@Injectable()
export class CreateZonaUseCase {
  constructor(
    private readonly zonaRepository: ZonaRepository,
  ) { }

  async execute({ nome }: CreateZonaRequest): Promise<ZonaResponse> {
    const model = new ZonaModel({
      nome,
    })

    const createdModel = await this.zonaRepository.save(model)

    return ZonaResponse.toResponse(createdModel)
  }
}
