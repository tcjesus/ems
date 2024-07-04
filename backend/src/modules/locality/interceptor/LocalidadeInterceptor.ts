import { LOCALIDADE_HEADER, LocalidadeHeader } from '@/locality/helpers/LocalidadeHeader'
import { CreateLocalidadeIfNotExistsUseCase } from '@/locality/usecases/CreateLocalidadeIfNotExistsUseCase'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'

import { Observable } from 'rxjs'

@Injectable()
export class LocalidadeInterceptor implements NestInterceptor {

  constructor(
    private readonly createLocalidadeIfNotExistsUseCase: CreateLocalidadeIfNotExistsUseCase,
  ) { }

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest()

    const header = request.headers[LOCALIDADE_HEADER]

    if (!header) {
      return next.handle()
    }

    const localidade = LocalidadeHeader.parse(header)

    const localidadeModel = await this.createLocalidadeIfNotExistsUseCase.execute(localidade)

    request.localidade = localidadeModel

    return next.handle();
  }
}
