import { CreateZonaRequest } from '@/emergency/structures/requests/CreateZonaRequest'
import { ZonaResponse } from '@/emergency/structures/responses/ZonaResponse'
import { CreateZonaUseCase } from '@/emergency/usecases/zona/CreateZonaUseCase'
import { DeleteZonaUseCase } from '@/emergency/usecases/zona/DeleteZonaUseCase'
import { FindZonaByIdUseCase } from '@/emergency/usecases/zona/FindZonaByIdUseCase'
import { ListZonasUseCase } from '@/emergency/usecases/zona/ListZonasUseCase'
import { UpdateZonaUseCase } from '@/emergency/usecases/zona/UpdateZonaUseCase'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ZonaFacade {
  constructor(
    private readonly listZonasUseCase: ListZonasUseCase,
    private readonly findZonaByIdUseCase: FindZonaByIdUseCase,
    private readonly createZonaUseCase: CreateZonaUseCase,
    private readonly updateZonaUseCase: UpdateZonaUseCase,
    private readonly deleteZonaUseCase: DeleteZonaUseCase,
  ) { }

  list(): Promise<ZonaResponse[]> {
    return this.listZonasUseCase.execute()
  }

  findById(id: number): Promise<ZonaResponse> {
    return this.findZonaByIdUseCase.execute(id)
  }

  create(input: CreateZonaRequest): Promise<ZonaResponse> {
    return this.createZonaUseCase.execute(input)
  }

  update(id: number, input: CreateZonaRequest): Promise<ZonaResponse> {
    return this.updateZonaUseCase.execute(id, input)
  }

  async delete(id: number): Promise<void> {
    await this.deleteZonaUseCase.execute(id)
  }
}
