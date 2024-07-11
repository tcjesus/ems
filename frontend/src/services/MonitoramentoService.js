import envs from "environment";
import handleResponse from "./handleResponse";
import AuthService from "./AuthService";
import LocalidadeService from "./LocalidadeService";

const baseUrl = `${envs.backendUrl}/monitoramento`

const buildHeaders = async () => ({
  'Content-Type': 'application/json',
  Authorization: await AuthService.getAuthorizationHeader(),
  'x-localidade': JSON.stringify(await LocalidadeService.getLocalidade()),
});

const buildQueryParams = (filters) => {
  let queryParams = []

  Object.keys(filters).forEach((key) => {
    if (Array.isArray(filters[key])) {
      queryParams.push(filters[key].map(v => `${key}[]=${encodeURI(v)}`).join('&'))
    } else {
      queryParams.push(`${key}=${encodeURI(filters[key])}`)
    }
  })

  return queryParams.join('&')
}

const Service = {
  /**
   * filters:
   * - tipoEmergencia?: number
   * - grandezas?: number[]
   * - zona?: number
   * - ude?: number
   */
  async request(filters) {
    const queryParams = buildQueryParams(filters);

    const response = await fetch(
      `${baseUrl}/request?${queryParams}`,
      {
        method: 'POST',
        headers: await buildHeaders(),
        body: JSON.stringify(filters),
      }
    );

    return handleResponse(response, () => this.request(filters));
  },

  /**
   * filters:
   * - dataInicial: Date
   * - dataFinal?: Date
   * - tipoEmergencia?: number
   * - grandezas?: number[]
   * - zona?: number
   * - ude?: number
   */
  async listRawData(filters) {
    const queryParams = buildQueryParams(filters);

    const response = await fetch(
      `${baseUrl}/raw-data?${queryParams}`,
      { headers: await buildHeaders() }
    );
    return handleResponse(response, () => this.listRawData());
  },

  /**
   * filters:
   * - dataInicial: Date
   * - dataFinal?: Date
   * - intervalo?: number
   * - tipoEmergencia?: number
   * - grandezas?: number[]
   * - zona?: number
   * - ude?: number
   */
  async getSummary(filters) {
    const queryParams = buildQueryParams(filters);

    const response = await fetch(
      `${baseUrl}/summary?${queryParams}`,
      {
        headers: await buildHeaders(),
      }
    );
    return handleResponse(response, () => this.getSummary());
  },
}

export default Service;