import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const LocalidadeParam = createParamDecorator((_data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.localidade
})
