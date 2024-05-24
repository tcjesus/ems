import { Injectable } from '@nestjs/common'

import { GrandezaRepository } from '@/emergency/repositories/GrandezaRepository'
import { DeleteResult } from 'typeorm'

@Injectable()
export class DeleteGrandezaUseCase {
  constructor(
    private readonly grandezaRepository: GrandezaRepository,
  ) { }

  async execute(id: number): Promise<DeleteResult> {
    return this.grandezaRepository.delete(id)
  }
}
