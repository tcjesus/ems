import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const AccountParam = createParamDecorator((_data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.account
})
