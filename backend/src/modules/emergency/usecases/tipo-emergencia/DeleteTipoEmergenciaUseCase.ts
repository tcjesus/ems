import { Injectable } from '@nestjs/common'

import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { DeleteResult } from 'typeorm'

@Injectable()
export class DeleteTipoEmergenciaUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
  ) { }

  async execute(id: number): Promise<DeleteResult> {
    return this.tipoEmergenciaRepository.delete(id)
  }
}
