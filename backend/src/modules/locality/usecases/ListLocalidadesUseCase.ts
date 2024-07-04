import { Injectable } from '@nestjs/common'

import { Role } from '@/account/structures/enum/Role'
import { Account } from '@/auth/interfaces/AuthPayload'
import { LocalidadeRepository } from '@/locality/repositories/LocalidadeRepository'
import { ListLocalidadeResponse } from '@/locality/structures/responses/ListLocalidadeResponse'

@Injectable()
export class ListLocalidadesUseCase {
  constructor(
    private readonly localidadeRepository: LocalidadeRepository,
  ) { }

  async execute(account: Account): Promise<ListLocalidadeResponse[]> {
    const models = await this.localidadeRepository.findAll()

    const accountPermissions = account?.permissions || []
    const accountPermissionsMap = accountPermissions
      .reduce((acc, permission) => {
        acc[permission.localidade.id] = permission.role
        return acc
      }, {})

    return models.map(model => ListLocalidadeResponse.toResponse(model, accountPermissionsMap[model.id] || (account?.isSuperAdmin ? Role.SUPER_ADMIN : Role.GUEST)))
  }
}
