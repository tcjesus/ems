import { Injectable, NotFoundException } from '@nestjs/common'

import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'
import { ErrorMessages } from '@/core/helpers/ErrorMessages'

@Injectable()
export class FindUdeByIdUseCase {
  constructor(
    private readonly udeRepository: UdeRepository,
  ) { }

  async execute(id: number): Promise<UdeResponse> {
    const model = await this.udeRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.ude.notFound)
    }

    return UdeResponse.toResponse(model)
  }
}
