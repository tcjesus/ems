import { Injectable, NotFoundException } from '@nestjs/common'

import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { SensorRepository } from '@/emergency/repositories/SensorRepository'
import { SensorResponse } from '@/emergency/structures/responses/SensorResponse'

@Injectable()
export class FindSensorByIdUseCase {
  constructor(
    private readonly sensorRepository: SensorRepository,
  ) { }

  async execute(id: number): Promise<SensorResponse> {
    const model = await this.sensorRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.sensor.notFound)
    }

    return SensorResponse.toResponse(model)
  }
}
