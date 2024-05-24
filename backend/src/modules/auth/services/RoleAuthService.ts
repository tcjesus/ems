import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthPayload } from '@/auth/interfaces/AuthPayload'
import { AuthService } from '@/auth/services/AuthService'

@Injectable()
export class RoleAuthService extends AuthService<AuthPayload> {
  constructor (
    @Inject('RoleAccessJwtService') accessJwtService: JwtService,
    @Inject('RoleRefreshJwtService') refreshJwtService: JwtService,
  ) {
    super(accessJwtService, refreshJwtService)
  }
}
