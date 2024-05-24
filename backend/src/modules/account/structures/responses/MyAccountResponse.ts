import { ApiProperty } from '@nestjs/swagger'

import { AccountModel } from '@/account/models/AccountModel'
import { AccountResponse } from '@/account/structures/responses/AccountResponse'

export class MyAccountResponse extends AccountResponse {
  @ApiProperty({ description: 'Account email', required: true, example: 'matob@live.com' })
  email: string

  static toResponse (model: AccountModel): MyAccountResponse {
    return {
      ...AccountResponse.toResponse(model),
      email: model.email,
    }
  }
}
