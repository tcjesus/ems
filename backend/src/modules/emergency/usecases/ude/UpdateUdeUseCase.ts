import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { DeteccaoEmergenciaModel } from '@/emergency/models/DeteccaoEmergenciaModel'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'
import { MonitoramentoGrandezaModel } from '@/emergency/models/MonitoramentoGrandezaModel'
import { SensorModel } from '@/emergency/models/SensorModel'
import { TipoEmergenciaModel } from '@/emergency/models/TipoEmergenciaModel'
import { ZonaModel } from '@/emergency/models/ZonaModel'
import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { DeteccaoEmergenciaRequest } from '@/emergency/structures/requests/DeteccaoEmergenciaRequest'
import { MonitoramentoGrandezaRequest } from '@/emergency/structures/requests/MonitoramentoGrandezaRequest'
import { UpdateUdeRequest } from '@/emergency/structures/requests/UpdateUdeRequest'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'
import { NotifyUdeUpdatedUseCase } from '@/emergency/usecases/ude/NotifyUdeUpdatedUseCase'
import { Localidade } from '@/locality/structures/Localidade'

@Injectable()
export class UpdateUdeUseCase {
  constructor(
    private readonly udeRepository: UdeRepository,
    private readonly notifyUdeUpdatedUseCase: NotifyUdeUpdatedUseCase,
  ) { }

  async execute(
    localidade: Localidade,
    id: number,
    {
      tipo,
      label,
      mac,
      latitude,
      longitude,
      operatingRange,
      zona: zonaId,
      deteccoesEmergencia: deteccoesEmergenciaInput
    }: UpdateUdeRequest
  ): Promise<UdeResponse> {
    const model = await this.udeRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.ude.notFound)
    }

    if (localidade.id !== model.localidadeId) {
      throw new ForbiddenException(ErrorMessages.emergency.localidade.notAllowed)
    }

    const zona = new ZonaModel({ id: zonaId?.id })

    const deteccoesEmergencia = deteccoesEmergenciaInput.map((deteccao: DeteccaoEmergenciaRequest) => {
      const { id: deteccaoId, tipoEmergencia: tipoEmergenciaId, monitoramentos: monitoramentosInput } = deteccao

      const monitoramentos = monitoramentosInput.map((monitoramento: MonitoramentoGrandezaRequest) => {
        const {
          id: monitoramentoId,
          sensor: sensorId,
          grandeza: grandezaId,
          thresholdMinimo,
          thresholdMaximo,
          intervaloAmostragem,
          taxaVariacaoMinima,
          ativo
        } = monitoramento

        return new MonitoramentoGrandezaModel({
          id: monitoramentoId,
          deteccaoEmergenciaId: deteccaoId,
          sensor: new SensorModel({ id: sensorId.id }),
          grandeza: new GrandezaModel({ id: grandezaId.id }),
          thresholdMinimo,
          thresholdMaximo,
          intervaloAmostragem,
          taxaVariacaoMinima,
          ativo: ativo ?? true,
        })
      })

      return new DeteccaoEmergenciaModel({
        id: deteccaoId,
        udeId: id,
        ude: model,
        tipoEmergencia: new TipoEmergenciaModel({ id: tipoEmergenciaId.id }),
        monitoramentosGrandeza: monitoramentos,
      })
    })

    model.tipo = tipo
    model.label = label
    model.mac = mac
    model.latitude = latitude
    model.longitude = longitude
    model.operatingRange = operatingRange

    model.zonaId = zona.id
    model.zona = zona
    model.deteccoesEmergencia = deteccoesEmergencia

    const updatedModel = await this.udeRepository.save(model)

    try {
      await this.notifyUdeUpdatedUseCase.execute(localidade, id)
    } catch (error) {
      console.error(error)
    }

    return UdeResponse.toResponse(updatedModel)
  }
}
