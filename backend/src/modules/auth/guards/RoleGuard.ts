import { ExecutionContext, Injectable } from '@nestjs/common'

import { Role } from '@/account/structures/enum/Role'
import { Roles } from '@/auth/decorators/Roles'
import { JwtGuard } from '@/auth/guards/JwtGuard'
import { AuthPayload } from '@/auth/interfaces/AuthPayload'
import { RoleAuthService } from '@/auth/services/RoleAuthService'
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

    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles?.length) {
      return true;
    }

    const req = context.switchToHttp().getRequest()
    const account = req.account

    return roles.includes(account?.role || Role.PUBLIC)
  }

  async handlePayload(req, _res, payload) {
    req.account = payload.account
  }
}
