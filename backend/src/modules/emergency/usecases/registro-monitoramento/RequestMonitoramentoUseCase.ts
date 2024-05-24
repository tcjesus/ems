import { Injectable } from '@nestjs/common';

import { RequestMonitoramentoRequest } from '@/emergency/structures/requests/RequestMonitoramentoRequest';

import { Environment as envs } from '@/Environment';
import { connect } from "mqtt"
import { UdeRepository } from '@/emergency/repositories/UdeRepository';
import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository';
import { GrandezaModel } from '@/emergency/models/GrandezaModel';

const util = require('util')

@Injectable()
export class RequestMonitoramentoUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
    private readonly udeRepository: UdeRepository,
  ) { }

  async execute(input: RequestMonitoramentoRequest): Promise<void> {
    const { zona: zonaId, tipoEmergencia: tipoEmergenciaId, ude: udeId, grandezas: grandezasIds } = input

    let zonaTopicSuffix = zonaId ? [`/zona/${zonaId.id}`] : undefined
    let devicesTopicSuffix: string[] | undefined = udeId ? [`/device/${udeId.id}`] : undefined

    if (!udeId && tipoEmergenciaId) {
      let filters: any = { 'd.tipoEmergenciaId': tipoEmergenciaId.id }
      if (zonaId) {
        filters = { ...filters, zonaId: zonaId.id }
      }
      const udes = await this.udeRepository.findManyBy(filters)
      devicesTopicSuffix = udes.map(ude => `/device/${ude.id}`)
    }

    let tipoEmergenciaGrandezas: GrandezaModel[] = []
    if (!grandezasIds?.length && tipoEmergenciaId) {
      const tipoEmergencia = await this.tipoEmergenciaRepository.findById(tipoEmergenciaId.id)
      tipoEmergenciaGrandezas = tipoEmergencia?.grandezas || []
    }
    const grandezas = (grandezasIds || tipoEmergenciaGrandezas).map(grandeza => grandeza.id)

    const payload = {
      grandezas
    }

    const topics = (
      (devicesTopicSuffix?.length && devicesTopicSuffix)
      || (zonaTopicSuffix?.length && zonaTopicSuffix)
      || ['']
    ).map(topic => `${envs.MQTT_TOPIC_REQUEST_DATA}${topic}`)

    const client = connect(envs.MQTT_BROKER);
    client.on("connect", async () => {
      console.log(`Publish message to topics: \n\t\t- ${topics.join('\n\t\t- ')}`)
      console.log(util.inspect(payload, { showHidden: false, depth: null, colors: true }))
      for (let topic of topics) {
        try {
          await client.publish(topic, JSON.stringify(payload));
        } catch (error) {
          console.error(error)
        }
      }
    });

    client.on("error", async (error) => {
      console.error(error)
    });
  }
}
