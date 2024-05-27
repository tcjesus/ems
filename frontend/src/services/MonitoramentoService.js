import envs from "environment";
import handleResponse from "./handleResponse";
import AuthService from "./AuthService";

const baseUrl = `${envs.backendUrl}/monitoramento`

const buildHeaders = async () => ({
  'Content-Type': 'application/json',
  Authorization: await AuthService.getAuthorizationHeader(),
});

const Service = {
  /**
   * filters:
   * - tipoEmergencia?: number
   * - grandezas?: number[]
   * - zona?: number
   * - ude?: number
   */
  async request(filters) {
    const queryParams = new URLSearchParams(filters).toString();

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
    const queryParams = new URLSearchParams(filters).toString();

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
    const queryParams = new URLSearchParams(filters).toString();

    const response = await fetch(
      `${baseUrl}/summary?${queryParams}`,
      {
        headers: await buildHeaders(),
        body: JSON.stringify(filters),
      }
    );
    return handleResponse(response, () => this.getSummary());
  },
}

export default Service;