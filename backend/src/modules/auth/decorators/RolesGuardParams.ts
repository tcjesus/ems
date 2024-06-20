import { Role } from '@/account/structures/enum/Role';
import { Reflector } from '@nestjs/core';

class Params {
  roles?: Role[] = [];
  requireLocalidade?: boolean = true;
}

export const RoleGuardParams = Reflector.createDecorator<Params>();