import { Injectable } from '@nestjs/common'

import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'
import { Localidade } from '@/locality/structures/Localidade'

@Injectable()
export class ListUdesUseCase {
  constructor(
    private readonly udeRepository: UdeRepository,
  ) { }

  async execute(localidade: Localidade): Promise<UdeResponse[]> {
    const models = await this.udeRepository.findManyBy({ 'ude.localidade_id': localidade.id })

    return models.map(model => UdeResponse.toResponse(model))
  }
}
