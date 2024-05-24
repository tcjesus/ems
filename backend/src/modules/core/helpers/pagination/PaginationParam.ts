import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const PaginationParam = createParamDecorator((_data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.pagination
})
