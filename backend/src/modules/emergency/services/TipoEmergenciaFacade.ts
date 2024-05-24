import { CreateTipoEmergenciaRequest } from '@/emergency/structures/requests/CreateTipoEmergenciaRequest'
import { TipoEmergenciaResponse } from '@/emergency/structures/responses/TipoEmergenciaResponse'
import { CreateTipoEmergenciaUseCase } from '@/emergency/usecases/tipo-emergencia/CreateTipoEmergenciaUseCase'
import { DeleteTipoEmergenciaUseCase } from '@/emergency/usecases/tipo-emergencia/DeleteTipoEmergenciaUseCase'
import { FindTipoEmergenciaByIdUseCase } from '@/emergency/usecases/tipo-emergencia/FindTipoEmergenciaByIdUseCase'
import { ListTiposEmergenciaUseCase } from '@/emergency/usecases/tipo-emergencia/ListTiposEmergenciaUseCase'
import { UpdateTipoEmergenciaUseCase } from '@/emergency/usecases/tipo-emergencia/UpdateTipoEmergenciaUseCase'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TipoEmergenciaFacade {
  constructor(
    private readonly listTiposEmergenciaUseCase: ListTiposEmergenciaUseCase,
    private readonly findTipoEmergenciaByIdUseCase: FindTipoEmergenciaByIdUseCase,
    private readonly createTipoEmergenciaUseCase: CreateTipoEmergenciaUseCase,
    private readonly updateTipoEmergenciaUseCase: UpdateTipoEmergenciaUseCase,
    private readonly deleteTipoEmergenciaUseCase: DeleteTipoEmergenciaUseCase,
  ) { }

  list(): Promise<TipoEmergenciaResponse[]> {
    return this.listTiposEmergenciaUseCase.execute()
  }

  findById(id: number): Promise<TipoEmergenciaResponse> {
    return this.findTipoEmergenciaByIdUseCase.execute(id)
  }

  create(input: CreateTipoEmergenciaRequest): Promise<TipoEmergenciaResponse> {
    return this.createTipoEmergenciaUseCase.execute(input)
  }

  update(id: number, input: CreateTipoEmergenciaRequest): Promise<TipoEmergenciaResponse> {
    return this.updateTipoEmergenciaUseCase.execute(id, input)
  }

  async delete(id: number): Promise<void> {
    await this.deleteTipoEmergenciaUseCase.execute(id)
  }
}
