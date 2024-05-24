import { CallHandler, ExecutionContext, Injectable, mixin, NestInterceptor, Type } from '@nestjs/common'

import { Observable } from 'rxjs'

import { PaginationOptions } from '@/core/helpers/pagination/PaginationOptions'

export function PaginationInterceptor (maxLimit = 10): Type<NestInterceptor> {
  @Injectable()
  class PaginationIntercept implements NestInterceptor {
    private readonly maxLimit: number

    constructor () {
      this.maxLimit = maxLimit
    }

    intercept (context: ExecutionContext, next: CallHandler): Observable<unknown> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = context.switchToHttp().getRequest()

      const page = req.query.page ? parseInt(req.query.page) : 1

      let limit = req.query.limit ? parseInt(req.query.limit) : this.maxLimit
      if (limit > this.maxLimit) limit = this.maxLimit

      req.pagination = new PaginationOptions(page, limit)

      return next.handle()
    }
  }

  return mixin(PaginationIntercept)
}
