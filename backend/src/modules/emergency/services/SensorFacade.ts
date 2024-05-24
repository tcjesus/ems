import { CreateSensorRequest } from '@/emergency/structures/requests/CreateSensorRequest'
import { SensorResponse } from '@/emergency/structures/responses/SensorResponse'
import { CreateSensorUseCase } from '@/emergency/usecases/sensor/CreateSensorUseCase'
import { DeleteSensorUseCase } from '@/emergency/usecases/sensor/DeleteSensorUseCase'
import { FindSensorByIdUseCase } from '@/emergency/usecases/sensor/FindSensorByIdUseCase'
import { ListSensoresUseCase } from '@/emergency/usecases/sensor/ListSensoresUseCase'
import { UpdateSensorUseCase } from '@/emergency/usecases/sensor/UpdateSensorUseCase'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SensorFacade {
  constructor(
    private readonly listSensoresUseCase: ListSensoresUseCase,
    private readonly findSensorByIdUseCase: FindSensorByIdUseCase,
    private readonly createSensorUseCase: CreateSensorUseCase,
    private readonly updateSensorUseCase: UpdateSensorUseCase,
    private readonly deleteSensorUseCase: DeleteSensorUseCase,
  ) { }

  list(): Promise<SensorResponse[]> {
    return this.listSensoresUseCase.execute()
  }

  findById(id: number): Promise<SensorResponse> {
    return this.findSensorByIdUseCase.execute(id)
  }

  create(input: CreateSensorRequest): Promise<SensorResponse> {
    return this.createSensorUseCase.execute(input)
  }

  update(id: number, input: CreateSensorRequest): Promise<SensorResponse> {
    return this.updateSensorUseCase.execute(id, input)
  }

  async delete(id: number): Promise<void> {
    await this.deleteSensorUseCase.execute(id)
  }
}
