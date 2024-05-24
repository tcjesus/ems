import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'

import * as Sentry from '@sentry/node'
import { Response } from 'express'

import { ErrorMessages } from '@/core/helpers/ErrorMessages'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch (exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = (exception.getResponse?.() as any)?.message
    const httpExceptionErrors =
      (message && Array.isArray(message))
        ? message
        : [message || exception.cause || exception.message]
    const errors = (exception instanceof HttpException ) ? httpExceptionErrors : [ErrorMessages.generic]

    if (!(exception instanceof HttpException)) {
      Sentry.captureException(exception)
      console.error(exception)
    }

    response.status(statusCode).json({ statusCode, errors })
  }
}
