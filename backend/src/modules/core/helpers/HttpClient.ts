import { AxiosInstance, AxiosRequestConfig } from 'axios'

export class HttpClient {
  constructor (
    private readonly axiosInstance: AxiosInstance
  ) {}

  async get<T> (path: string, params?: object): Promise<T> {
    const response = await this.axiosInstance({ url: encodeURI(path), method: 'GET', params })

    return response ? response.data : null
  }

  async post<I, T> (path: string, body?: I): Promise<T> {
    const requestConfig: AxiosRequestConfig = { url: encodeURI(path), method: 'POST', data: body }

    const response = await this.axiosInstance(requestConfig)

    return response ? response.data : null
  }
}
