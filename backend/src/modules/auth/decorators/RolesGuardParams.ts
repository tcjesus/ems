import { Role } from '@/account/structures/enum/Role';
import { Reflector } from '@nestjs/core';

class Params {
  roles?: Role[];
  requireLocalidade?: boolean;

  constructor(roles: Role[] = [], requireLocalidade: boolean = true) {
    this.roles = roles;
    this.requireLocalidade = requireLocalidade;
  }
}

export const RoleGuardParams = Reflector.createDecorator<Params>();