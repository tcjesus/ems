import { Injectable, NotFoundException } from '@nestjs/common'

import { ErrorMessages } from '@/core/helpers/ErrorMessages'
import { EspecificacaoGrandezaModel } from '@/emergency/models/EspecificacaoGrandezaModel'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'
import { SensorRepository } from '@/emergency/repositories/SensorRepository'
import { EspecificacaoGrandezaRequest } from '@/emergency/structures/requests/EspecificacaoGrandezaRequest'
import { UpdateSensorRequest } from '@/emergency/structures/requests/UpdateSensorRequest'
import { SensorResponse } from '@/emergency/structures/responses/SensorResponse'

@Injectable()
export class UpdateSensorUseCase {
  constructor(
    private readonly sensorRepository: SensorRepository,
  ) { }

  async execute(
    id: number,
    { modelo, descricao, especificacoes: especificacoesInput }: UpdateSensorRequest
  ): Promise<SensorResponse> {
    const model = await this.sensorRepository.findById(id)
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.sensor.notFound)
    }

    const especificacoes = especificacoesInput.map((especificacao: EspecificacaoGrandezaRequest) => {
      const { grandeza: grandezaId, valorMinimo, valorMaximo, sinal } = especificacao

      return new EspecificacaoGrandezaModel({
        id: especificacao.id,
        sensorId: model.id,
        sensor: model,
        grandezaId: grandezaId.id,
        grandeza: new GrandezaModel({ id: grandezaId.id }),
        valorMinimo,
        valorMaximo,
        sinal,
      })
    })

    model.modelo = modelo
    model.descricao = descricao
    model.especificacoes = especificacoes

    const updatedModel = await this.sensorRepository.save(model)

    return SensorResponse.toResponse(updatedModel)
  }
}
