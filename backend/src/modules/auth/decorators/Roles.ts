import { Role } from '@/account/structures/enum/Role';
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<Role[]>();