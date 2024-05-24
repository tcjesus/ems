import { Injectable } from '@nestjs/common'

import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'

@Injectable()
export class ListUdesUseCase {
  constructor(
    private readonly udeRepository: UdeRepository,
  ) { }

  async execute(): Promise<UdeResponse[]> {
    const models = await this.udeRepository.findAll()

    return models.map(model => UdeResponse.toResponse(model))
  }
}
