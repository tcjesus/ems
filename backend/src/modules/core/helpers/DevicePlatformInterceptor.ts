import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common'

import { Request } from 'express'
import { Observable } from 'rxjs'

@Injectable()
export class DevicePlatformInterceptor implements NestInterceptor {
  intercept (context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req: Request = context.switchToHttp().getRequest()
    req.headers['x-device-platform'] = req.header('x-device-platform') || 'android'
    return next.handle()
  }
}
