import { ApiProperty } from '@nestjs/swagger'

export class FetchAccountAvatarResponse {
  @ApiProperty({ description: 'Account identifier', example: 1 })
  id: number
}
