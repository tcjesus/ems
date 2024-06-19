import envs from "environment";
import AuthService from "./AuthService";
import Role from "./Role";
import handleResponse from "./handleResponse";

const baseUrl = `${envs.backendUrl}/localidades`

const buildHeaders = async () => ({
  'Content-Type': 'application/json',
  Authorization: await AuthService.getAuthorizationHeader(),
});

const Service = {

  async getLocalidade() { return JSON.parse(await localStorage.getItem('localidade')); },

  async setLocalidade(localidade) {
    await localStorage.setItem('localidade', JSON.stringify(localidade));
  },

  async getRole() {
    const account = await AuthService.getAccount();
    if (account?.isSuperAdmin) return Role.SUPER_ADMIN;

    const localidade = await this.getLocalidade();

    return localidade?.role || Role.GUEST;
  },

  async list() {
    const response = await fetch(
      baseUrl,
      { headers: await buildHeaders() }
    );
    return handleResponse(response, () => this.list());
  },
}

export default Service;