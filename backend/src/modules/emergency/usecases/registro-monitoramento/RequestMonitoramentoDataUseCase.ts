import { BadRequestException, Injectable } from '@nestjs/common';

import { RequestMonitoramentoDataRequest } from '@/emergency/structures/requests/RequestMonitoramentoDataRequest';

import { Environment as envs } from '@/Environment';
import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository';
import { UdeRepository } from '@/emergency/repositories/UdeRepository';
import { connect } from "mqtt";

const util = require('util')

@Injectable()
export class RequestMonitoramentoDataUseCase {
  constructor(
    private readonly tipoEmergenciaRepository: TipoEmergenciaRepository,
    private readonly udeRepository: UdeRepository,
  ) { }

  async execute(
    {
      tipoEmergencia: tipoEmergenciaId,
      grandezas,
      zona: zonaId,
      ude: udeId
    }: RequestMonitoramentoDataRequest
  ): Promise<void> {
    let zonaTopicSuffix = zonaId ? [`/zona/${zonaId}`] : undefined
    let devicesTopicSuffix: string[] | undefined = udeId ? [`/device/${udeId}`] : undefined

    const tipoEmergencia = tipoEmergenciaId
      ? await this.tipoEmergenciaRepository.findById(tipoEmergenciaId, { relations: ['grandezas'] })
      : undefined

    const udesQuery = udeId
      ? undefined
      : zonaId
        ? tipoEmergencia
          ? this.udeRepository.findManyBy({ 'ude.zonaId': zonaId, 'd.tipoEmergenciaId': tipoEmergenciaId }, { select: ['ude.id'] })
          : this.udeRepository.findManyBy({ 'ude.zonaId': zonaId }, { select: ['ude.id'] })
        : tipoEmergencia
          ? this.udeRepository.findManyBy({ 'd.tipoEmergenciaId': tipoEmergenciaId }, { select: ['ude.id'] })
          : undefined

    const udesIds = udeId
      ? [udeId]
      : (await udesQuery)?.map(ude => ude.id)

    devicesTopicSuffix = udesIds?.map(id => `/device/${id}`)

    const grandezasIds = grandezas?.length
      ? grandezas
      : tipoEmergencia
        ? tipoEmergencia.grandezas.map(grandeza => grandeza.id)
        : undefined

    if (!grandezasIds?.length) {
      throw new BadRequestException('Ao menos uma grandeza deve ser informada')
    }

    const payload = {
      variables: grandezasIds
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
