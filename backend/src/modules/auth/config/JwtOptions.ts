import { Environment as envs } from '@/Environment'

export const JwtOptions = {
  access: {
    secret: envs.JWT_SECRET,
    expiresIn: '12h',
  },
  refresh: {
    secret: envs.JWT_SECRET,
    expiresIn: '30d',
  },
}
