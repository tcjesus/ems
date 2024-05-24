/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'

import * as Sentry from '@sentry/node'
import { Response } from 'express'

import { AuthService } from '@/auth/services/AuthService'

export abstract class JwtGuard<PAYLOAD extends object> implements CanActivate {
  constructor(protected authService: AuthService<any>) { }

  abstract handlePayload(req: any, res: Response, payload: PAYLOAD): Promise<void>

  async canActivate (context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req: any = context.switchToHttp().getRequest()
    const res: Response = context.switchToHttp().getResponse()
    const accessToken: string = req.get('authorization') || ''

    try {
      const payload = await this.authService.verifyAccessToken(accessToken)

      if (accessToken) {
        await this.handlePayload(req, res, payload)
        return true
      }

      throw new UnauthorizedException('Access token is required.')
    } catch (error) {
      if (error.name === 'UnauthorizedException') {
        throw error
      }

      if (error.name === 'TokenExpiredError') {
        const refreshToken: string = req.get('X-Refresh-Token') || ''

        if (refreshToken) {
          await this.authService.verifyRefreshToken(refreshToken)
          const { iat, exp, ...accessTokenPayload } = await this.authService.verifyAccessToken(accessToken, true) as any
          
          await this.handlePayload(req, res, accessTokenPayload)

          const newAccessToken = await this.authService.generateAccessToken(accessTokenPayload)
          res.setHeader('Authorization', `Bearer ${newAccessToken}`)

          const newRefreshToken = await this.authService.generateRefreshToken(accessTokenPayload)
          res.setHeader('x-refresh-token', `Bearer ${newRefreshToken}`)

          return true
        }

        throw new UnauthorizedException('Access token expired and the refresh token was not found. Unable to generate new access token.')
      }

      Sentry.captureException(error)

      throw new UnauthorizedException('Unauthorized')
    }
  }
}
