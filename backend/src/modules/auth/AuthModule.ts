import { DynamicModule, Global, Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { RoleGuard } from '@/auth/guards/RoleGuard'
import { RoleAuthService } from '@/auth/services/RoleAuthService'

@Global()
@Module({})
export class AuthModule {
  static registerRole(jwtOptions: any): DynamicModule {
    const { accessJwtService, refreshJwtService } = AuthModule.createJwtServices(jwtOptions)

    return {
      module: AuthModule,
      imports: [
        PassportModule.register({defaultStrategy: 'jwt'})
      ],
      providers: [
        RoleGuard,
        RoleAuthService,
        { provide: 'RoleAccessJwtService', useValue: accessJwtService },
        { provide: 'RoleRefreshJwtService', useValue: refreshJwtService },
      ],
      exports: [
        RoleGuard,
        RoleAuthService,
      ],
    }
  }

  static createJwtServices (jwtOptions: any) {
    const accessJwtService = new JwtService({
      secret: jwtOptions.access.secret,
      signOptions: {
        expiresIn: jwtOptions.access.expiresIn,
      },
    })
    const refreshJwtService = new JwtService({
      secret: jwtOptions.refresh.secret,
      signOptions: {
        expiresIn: jwtOptions.refresh.expiresIn,
      },
    })

    return { accessJwtService, refreshJwtService }
  }
}
