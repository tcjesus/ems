import { NotifyUdeUpdatedPayload } from '@/emergency/structures/payloads/NotifyUdeUpdatedPayload'
import { CreateUdeRequest } from '@/emergency/structures/requests/CreateUdeRequest'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'
import { CreateUdeUseCase } from '@/emergency/usecases/ude/CreateUdeUseCase'
import { DeleteUdeUseCase } from '@/emergency/usecases/ude/DeleteUdeUseCase'
import { FindUdeByIdUseCase } from '@/emergency/usecases/ude/FindUdeByIdUseCase'
import { ListUdesUseCase } from '@/emergency/usecases/ude/ListUdesUseCase'
import { NotifyUdeUpdatedUseCase } from '@/emergency/usecases/ude/NotifyUdeUpdatedUseCase'
import { UpdateUdeUseCase } from '@/emergency/usecases/ude/UpdateUdeUseCase'
import { Localidade } from '@/locality/structures/Localidade'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UdeFacade {
  constructor(
    private readonly listUdesUseCase: ListUdesUseCase,
    private readonly findUdeByIdUseCase: FindUdeByIdUseCase,
    private readonly createUdeUseCase: CreateUdeUseCase,
    private readonly updateUdeUseCase: UpdateUdeUseCase,
    private readonly deleteUdeUseCase: DeleteUdeUseCase,
    private readonly notifyUdeUpdatedUseCase: NotifyUdeUpdatedUseCase,
  ) { }

  list(localidade: Localidade): Promise<UdeResponse[]> {
    return this.listUdesUseCase.execute(localidade)
  }

  findById(localidade: Localidade, id: number): Promise<UdeResponse> {
    return this.findUdeByIdUseCase.execute(localidade, id)
  }

  create(localidade: Localidade, input: CreateUdeRequest): Promise<UdeResponse> {
    return this.createUdeUseCase.execute(localidade, input)
  }

  update(localidade: Localidade, id: number, input: CreateUdeRequest): Promise<UdeResponse> {
    return this.updateUdeUseCase.execute(localidade, id, input)
  }

  async delete(localidade: Localidade, id: number): Promise<void> {
    await this.deleteUdeUseCase.execute(localidade, id)
  }

  notifyUpdate(localidade: Localidade, id: number): Promise<NotifyUdeUpdatedPayload> {
    return this.notifyUdeUpdatedUseCase.execute(localidade, id)
  }
}
