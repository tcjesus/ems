import envs from "environment";
import handleResponse from "./handleResponse";
import AuthService from "./AuthService";

const baseUrl = `${envs.backendUrl}/monitoramento`

const buildHeaders = async () => ({
  'Content-Type': 'application/json',
  Authorization: await AuthService.getAuthorizationHeader(),
});

const Service = {
  async request(filters) {
    const response = await fetch(
      `${baseUrl}/request`,
      {
        method: 'POST',
        headers: await buildHeaders(),
        body: JSON.stringify(filters),
      }
    );

    return handleResponse(response, () => this.request(filters));
  },

  async listRawData() {
    const response = await fetch(
      `${baseUrl}/bruto`,
      { headers: await buildHeaders() }
    );
    return handleResponse(response, () => this.listRawData());
  },

  async summary(filters) {
    const response = await fetch(
      `${baseUrl}/summary`,
      {
        headers: await buildHeaders(),
        body: JSON.stringify(filters),
      }
    );
    return handleResponse(response, () => this.summary());
  },
}

export default Service;