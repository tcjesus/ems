import { SensorRepository } from '@/emergency/repositories/SensorRepository'
import { Injectable } from '@nestjs/common'

import { DeleteResult } from 'typeorm'

@Injectable()
export class DeleteSensorUseCase {
  constructor(
    private readonly sensorRepository: SensorRepository,
  ) { }

  async execute(id: number): Promise<DeleteResult> {
    return this.sensorRepository.delete(id)
  }
}
