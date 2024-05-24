import { ApiProperty } from '@nestjs/swagger'

import { AccountResponse } from '@/account/structures/responses/AccountResponse'

export class SignInResponse {
  @ApiProperty({ description: 'Account', type: AccountResponse })
  account: AccountResponse

  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxOTE2MjM5MDIyfQ.et89zLGbgesNcyXkxkkfA_RfnoL2VGItMczChu_h2Kk',
  })
  accessToken?: string

  @ApiProperty({
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxOTE2MjM5MDIyfQ.et89zLGbgesNcyXkxkkfA_RfnoL2VGItMczChu_h2Kk',
  })
  refreshToken?: string
}
