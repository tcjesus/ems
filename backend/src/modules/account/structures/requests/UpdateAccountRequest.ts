import { CreateAccountRequest } from "@/account/structures/requests/CreateAccountRequest";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateAccountRequest extends CreateAccountRequest {
  @IsOptional()
  @IsString()
  @MaxLength(256)
  @ApiProperty({ description: 'Senha do Usuário', maxLength: 64, example: '123456' })
  password: string
}
