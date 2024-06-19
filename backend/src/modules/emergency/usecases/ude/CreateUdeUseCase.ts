import { Injectable } from '@nestjs/common'

import { DeteccaoEmergenciaModel } from '@/emergency/models/DeteccaoEmergenciaModel'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'
import { MonitoramentoGrandezaModel } from '@/emergency/models/MonitoramentoGrandezaModel'
import { SensorModel } from '@/emergency/models/SensorModel'
import { TipoEmergenciaModel } from '@/emergency/models/TipoEmergenciaModel'
import { UdeModel } from '@/emergency/models/UdeModel'
import { ZonaModel } from '@/emergency/models/ZonaModel'
import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { CreateUdeRequest } from '@/emergency/structures/requests/CreateUdeRequest'
import { DeteccaoEmergenciaRequest } from '@/emergency/structures/requests/DeteccaoEmergenciaRequest'
import { MonitoramentoGrandezaRequest } from '@/emergency/structures/requests/MonitoramentoGrandezaRequest'
import { UdeResponse } from '@/emergency/structures/responses/UdeResponse'
import { NotifyUdeUpdatedUseCase } from '@/emergency/usecases/ude/NotifyUdeUpdatedUseCase'
import { Localidade } from '@/locality/structures/Localidade'
import { IsolationLevel, Transactional } from 'typeorm-transactional'

@Injectable()
export class CreateUdeUseCase {
  constructor(
    private readonly udeRepository: UdeRepository,
    private readonly notifyUdeUpdatedUseCase: NotifyUdeUpdatedUseCase,
  ) { }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async execute(
    localidade: Localidade,
    {
      tipo,
      label,
      mac,
      latitude,
      longitude,
      operatingRange,
      zona: zonaId,
      deteccoesEmergencia: deteccoesEmergenciaInput
    }: CreateUdeRequest
  ): Promise<UdeResponse> {
    const zona = new ZonaModel({ id: zonaId?.id })

    const deteccoesEmergencia = deteccoesEmergenciaInput.map((deteccao: DeteccaoEmergenciaRequest) => {
      const { tipoEmergencia: tipoEmergenciaId, monitoramentos: monitoramentosInput } = deteccao

      const monitoramentos = monitoramentosInput.map((monitoramento: MonitoramentoGrandezaRequest) => {
        const {
          sensor: sensorId,
          grandeza: grandezaId,
          thresholdMinimo,
          thresholdMaximo,
          intervaloAmostragem,
          taxaVariacaoMinima,
          ativo
        } = monitoramento

        return new MonitoramentoGrandezaModel({
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
        tipoEmergencia: new TipoEmergenciaModel({ id: tipoEmergenciaId.id }),
        monitoramentosGrandeza: monitoramentos,
      })
    })

    const model = new UdeModel({
      tipo,
      label,
      mac,
      latitude,
      longitude,
      operatingRange,
      zona,
      deteccoesEmergencia,
      localidadeId: localidade.id,
    })

    const createdModel = await this.udeRepository.save(model)

    try {
      await this.notifyUdeUpdatedUseCase.execute(localidade, createdModel.id)
    } catch (error) {
      console.error(error)
    }

    return UdeResponse.toResponse(createdModel)
  }
}
