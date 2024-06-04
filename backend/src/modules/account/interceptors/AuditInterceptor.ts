import { AuditModel } from '@/account/models/AuditModel'
import { AuditRepository } from '@/account/repositories/AuditRepository'
import { CallHandler, ExecutionContext, Injectable, mixin, NestInterceptor, Type } from '@nestjs/common'

import { Observable, tap } from 'rxjs'

export function AuditInterceptor(table?: string): Type<NestInterceptor> {
  @Injectable()
  class AuditIntercept implements NestInterceptor {

    private readonly table?: string = table

    constructor(
      private readonly auditRepository: AuditRepository,
    ) {
      this.table = table
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
      const request = context.switchToHttp().getRequest()

      const { method, _parsedUrl, query, params, account, body: requestBody } = request
      const resource = _parsedUrl.pathname.substring(1)

      const oldRecordQuery = this.table && ['PUT', 'DELETE'].includes(method)
        ? this.auditRepository.nativeQuery(`SELECT * FROM ${this.table} WHERE id = $1`, [params.id])
        : null

      return next.handle().pipe(
        tap(async (responseBody) => {
          try {
            console.log(`[${new Date().toISOString()} ${method}] ${resource} - ${JSON.stringify({ query, params })}`)

            const results = oldRecordQuery && await oldRecordQuery

            await this.auditRepository.save(new AuditModel({
              accountId: account.id,
              method,
              resource,
              query: query && Object.keys(query).length ? JSON.stringify(query) : undefined,
              params: params && Object.keys(params).length ? JSON.stringify(params) : undefined,
              request: requestBody && Object.keys(requestBody).length ? JSON.stringify(requestBody) : undefined,
              oldRecord: results?.length ? JSON.stringify(results[0]) : undefined,
              response: responseBody && Object.keys(responseBody).length ? JSON.stringify(responseBody) : undefined,
            }))
          } catch (error) {
            console.error('Error saving audit log')
            console.error(error)
          }
        }),
      );
    }
  }

  return mixin(AuditIntercept)
}
