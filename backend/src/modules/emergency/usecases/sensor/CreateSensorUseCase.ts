import { Injectable } from '@nestjs/common'

import { EspecificacaoGrandezaModel } from '@/emergency/models/EspecificacaoGrandezaModel'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'
import { SensorModel } from '@/emergency/models/SensorModel'
import { SensorRepository } from '@/emergency/repositories/SensorRepository'
import { CreateSensorRequest } from '@/emergency/structures/requests/CreateSensorRequest'
import { EspecificacaoGrandezaRequest } from '@/emergency/structures/requests/EspecificacaoGrandezaRequest'
import { SensorResponse } from '@/emergency/structures/responses/SensorResponse'

@Injectable()
export class CreateSensorUseCase {
  constructor(
    private readonly sensorRepository: SensorRepository,
  ) { }

  async execute(input: CreateSensorRequest): Promise<SensorResponse> {
    const { modelo, descricao, especificacoes: especificacoesInput } = input

    const especificacoes = especificacoesInput.map((especificacao: EspecificacaoGrandezaRequest) => {
      const { grandeza: grandezaId, valorMinimo, valorMaximo, sinal } = especificacao

      return new EspecificacaoGrandezaModel({
        grandeza: new GrandezaModel({ id: grandezaId.id }),
        valorMinimo,
        valorMaximo,
        sinal,
      })
    })

    const model = new SensorModel({
      modelo,
      descricao,
      especificacoes,
    })

    const createdModel = await this.sensorRepository.save(model)

    return SensorResponse.toResponse(createdModel)
  }
}
