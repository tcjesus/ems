import { Injectable } from '@nestjs/common'

import { SensorRepository } from '@/emergency/repositories/SensorRepository'
import { SensorResponse } from '@/emergency/structures/responses/SensorResponse'

@Injectable()
export class ListSensoresUseCase {
  constructor(
    private readonly sensorRepository: SensorRepository,
  ) { }

  async execute(): Promise<SensorResponse[]> {
    const models = await this.sensorRepository.findAll()

    return models.map(model => SensorResponse.toResponse(model))
  }
}
