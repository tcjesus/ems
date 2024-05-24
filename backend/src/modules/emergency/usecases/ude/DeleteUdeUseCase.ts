import { Injectable } from '@nestjs/common'

import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { DeleteResult } from 'typeorm'

@Injectable()
export class DeleteUdeUseCase {
  constructor(
    private readonly udeRepository: UdeRepository,
  ) { }

  async execute(id: number): Promise<DeleteResult> {
    return this.udeRepository.delete(id)
  }
}
