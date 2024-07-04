import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';


import { Environment as envs } from '@/Environment';
import { ErrorMessages } from '@/core/helpers/ErrorMessages';
import { UdeRepository } from '@/emergency/repositories/UdeRepository';
import { NotifyUdeUpdatedPayload } from '@/emergency/structures/payloads/NotifyUdeUpdatedPayload';
import { connect } from "mqtt"
import { Localidade } from '@/locality/structures/Localidade';

const util = require('util')

@Injectable()
export class NotifyUdeUpdatedUseCase {
  constructor(
    private readonly udeRepository: UdeRepository,
  ) { }

  async execute(localidade: Localidade, id: number): Promise<NotifyUdeUpdatedPayload> {
    const model = await this.udeRepository.findById(id);
    if (!model) {
      throw new NotFoundException(ErrorMessages.emergency.ude.notFound);
    }

    if (localidade.id !== model.localidadeId) {
      throw new ForbiddenException(ErrorMessages.emergency.localidade.notAllowed)
    }

    return new Promise((resolve, reject) => {
      const client = connect(envs.MQTT_BROKER);

      client.on("connect", async () => {
        const payload = NotifyUdeUpdatedPayload.parse(model);

        console.log('Publish message to topic:', envs.MQTT_TOPIC_UPDATE_UDE)
        console.log(util.inspect(payload, { showHidden: false, depth: null, colors: true }))

        await client.publish(envs.MQTT_TOPIC_UPDATE_UDE, JSON.stringify(payload));

        resolve(payload);
      });

      client.on("error", async (error) => {
        reject(error);
      });
    })
  }
}
