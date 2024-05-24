import { CreateGrandezaRequest } from '@/emergency/structures/requests/CreateGrandezaRequest'
import { GrandezaResponse } from '@/emergency/structures/responses/GrandezaResponse'
import { CreateGrandezaUseCase } from '@/emergency/usecases/grandeza/CreateGrandezaUseCase'
import { DeleteGrandezaUseCase } from '@/emergency/usecases/grandeza/DeleteGrandezaUseCase'
import { FindGrandezaByIdUseCase } from '@/emergency/usecases/grandeza/FindGrandezaByIdUseCase'
import { ListGrandezasUseCase } from '@/emergency/usecases/grandeza/ListGrandezasUseCase'
import { UpdateGrandezaUseCase } from '@/emergency/usecases/grandeza/UpdateGrandezaUseCase'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GrandezaFacade {
  constructor(
    private readonly listGrandezasUseCase: ListGrandezasUseCase,
    private readonly findGrandezaByIdUseCase: FindGrandezaByIdUseCase,
    private readonly createGrandezaUseCase: CreateGrandezaUseCase,
    private readonly updateGrandezaUseCase: UpdateGrandezaUseCase,
    private readonly deleteGrandezaUseCase: DeleteGrandezaUseCase,
  ) { }

  list(): Promise<GrandezaResponse[]> {
    return this.listGrandezasUseCase.execute()
  }

  findById(id: number): Promise<GrandezaResponse> {
    return this.findGrandezaByIdUseCase.execute(id)
  }

  create(input: CreateGrandezaRequest): Promise<GrandezaResponse> {
    return this.createGrandezaUseCase.execute(input)
  }

  update(id: number, input: CreateGrandezaRequest): Promise<GrandezaResponse> {
    return this.updateGrandezaUseCase.execute(id, input)
  }

  async delete(id: number): Promise<void> {
    await this.deleteGrandezaUseCase.execute(id)
  }
}
