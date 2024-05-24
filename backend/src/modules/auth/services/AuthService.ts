import { JwtService } from '@nestjs/jwt'

export abstract class AuthService<PAYLOAD extends object> {
  constructor (
    protected accessJwtService: JwtService,
    protected refreshJwtService: JwtService
  ) {}

  async verifyAccessToken (accessToken: string, ignoreExpiration = false): Promise<PAYLOAD> {
    const pattern = /^(Bearer )(.*)$/i
    const token = pattern.test(accessToken) ? accessToken.replace(pattern, '$2') : accessToken
    return this.accessJwtService.verify(token, { ignoreExpiration })
  }

  async generateAccessToken (payload: PAYLOAD): Promise<string> {
    return this.accessJwtService.signAsync(payload)
  }

  async verifyRefreshToken (refreshToken: string): Promise<PAYLOAD> {
    const pattern = /^(Bearer )(.*)$/i
    const token = pattern.test(refreshToken) ? refreshToken.replace(pattern, '$2') : refreshToken
    return this.refreshJwtService.verify(token)
  }

  async generateRefreshToken (payload: PAYLOAD): Promise<string> {
    return this.refreshJwtService.signAsync(payload)
  }
}