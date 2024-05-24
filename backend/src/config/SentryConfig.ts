import { Environment as envs } from '@/Environment'

const envAllowList = ['production', 'homolog']

export const SentryConfig = {
  dsn: envs.SENTRY_DSN,
  environment: envs.NODE_ENV,
  beforeSend: (event) => {
    return (envAllowList.indexOf(envs.NODE_ENV) !== -1) ? event : false
  }
}
