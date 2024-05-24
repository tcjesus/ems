import { NotifyUdeUpdatedPayload } from '@/emergency/structures/payloads/NotifyUdeUpdatedPayload'
import { CreateUdeRequest } from '@/emergency/structures/requests/CreateUdeRequest'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'
import { CreateUdeUseCase } from '@/emergency/usecases/ude/CreateUdeUseCase'
import { DeleteUdeUseCase } from '@/emergency/usecases/ude/DeleteUdeUseCase'
import { FindUdeByIdUseCase } from '@/emergency/usecases/ude/FindUdeByIdUseCase'
import { ListUdesUseCase } from '@/emergency/usecases/ude/ListUdesUseCase'
import { NotifyUdeUpdatedUseCase } from '@/emergency/usecases/ude/NotifyUdeUpdatedUseCase'
import { UpdateUdeUseCase } from '@/emergency/usecases/ude/UpdateUdeUseCase'
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

  list(): Promise<UdeResponse[]> {
    return this.listUdesUseCase.execute()
  }

  findById(id: number): Promise<UdeResponse> {
    return this.findUdeByIdUseCase.execute(id)
  }

  create(input: CreateUdeRequest): Promise<UdeResponse> {
    return this.createUdeUseCase.execute(input)
  }

  update(id: number, input: CreateUdeRequest): Promise<UdeResponse> {
    return this.updateUdeUseCase.execute(id, input)
  }

  async delete(id: number): Promise<void> {
    await this.deleteUdeUseCase.execute(id)
  }

  notifyUpdate(id: number): Promise<NotifyUdeUpdatedPayload> {
    return this.notifyUdeUpdatedUseCase.execute(id)
  }
}
