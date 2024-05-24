import { AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'

export function configureRetry (axiosInstance: AxiosInstance, retries = 3) {
  axiosRetry(axiosInstance, {
    retries,
    shouldResetTimeout: true /* Unless shouldResetTimeout is set, the plugin interprets the request timeout as a
                                  global value, so it is not used for each retry but for the whole request lifecycle. */,
    retryDelay: (retryCount) => Math.pow(3, retryCount - 1) * 200, // Greater than exponentialDelay: 200, 600, 1800
  })
}
