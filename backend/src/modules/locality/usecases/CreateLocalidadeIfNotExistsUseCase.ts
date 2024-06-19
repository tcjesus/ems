import { BadRequestException, Injectable } from '@nestjs/common'

import { LocalidadeModel } from '@/locality/models/LocalidadeModel'
import { LocalidadeRepository } from '@/locality/repositories/LocalidadeRepository'
import { Localidade } from '@/locality/structures/Localidade'

@Injectable()
export class CreateLocalidadeIfNotExistsUseCase {
  constructor(
    private readonly localidadeRepository: LocalidadeRepository,
  ) { }

  async execute(localidade: Localidade): Promise<LocalidadeModel> {
    if (!localidade) {
      throw new BadRequestException('Localidade is required')
    }

    const { cidade } = localidade
    if (!cidade?.id) {
      throw new BadRequestException('Cidade is required')
    }

    let model = await this.localidadeRepository.findOneBy({ cidade_id: cidade.id })
    if (!model) {
      model = new LocalidadeModel({ cidadeId: cidade.id })
      model = await this.localidadeRepository.save(model)
    }

    return model
  }
}
