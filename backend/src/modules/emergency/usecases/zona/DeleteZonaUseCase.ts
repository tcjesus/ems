import { ZonaRepository } from '@/emergency/repositories/ZonaRepository '
import { Injectable } from '@nestjs/common'

import { DeleteResult } from 'typeorm'

@Injectable()
export class DeleteZonaUseCase {
  constructor(
    private readonly zonaRepository: ZonaRepository,
  ) { }

  async execute(id: number): Promise<DeleteResult> {
    return this.zonaRepository.delete(id)
  }
}
