import { ExecutionContext, Injectable } from '@nestjs/common'

import { Role } from '@/account/structures/enum/Role'
import { RoleGuardParams } from '@/auth/decorators/RolesGuardParams'
import { JwtGuard } from '@/auth/guards/JwtGuard'
import { AuthPayload } from '@/auth/interfaces/AuthPayload'
import { RoleAuthService } from '@/auth/services/RoleAuthService'
import { LocalidadeHeader } from '@/locality/helpers/LocalidadeHeader'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RoleGuard extends JwtGuard<AuthPayload> {
  constructor(
    defaultAuthService: RoleAuthService,
    private reflector: Reflector,
  ) {
    super(defaultAuthService)
  }

  async canActivate(context: ExecutionContext) {
    const authorized = await super.canActivate(context)
    if (!authorized) return false

    const roleGuardParams = this.reflector.get(RoleGuardParams, context.getHandler())
    const { roles, requireLocalidade } = roleGuardParams || {}
    if (!roles?.length) return true

    const req = context.switchToHttp().getRequest()

    const account = req.account
    if (!account) return false

    const permissions = account.permissions || []

    if (account.isSuperAdmin) return true

    const localidade = LocalidadeHeader.getFromRequest(req)
    if (requireLocalidade && !localidade?.cidade?.id) return false

    let accountRoles = requireLocalidade
      ? permissions.find(p => p.cidadeId === localidade.cidade?.id)?.roles || []
      : permissions.reduce((acc, p) => acc.concat(p.roles), [])
    accountRoles.push(Role.GUEST)
    accountRoles = [...new Set(accountRoles)]

    return roles.some(role => accountRoles.includes(role))
  }

  async handlePayload(req, _res, payload) {
    req.account = payload.account
  }
}
