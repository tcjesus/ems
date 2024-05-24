import envs from "environment";
import handleResponse from "./handleResponse";

const baseUrl = `${envs.backendUrl}/usuarios`

const Service = {

  async getAccessToken() { return localStorage.getItem('accessToken') },

  async getAuthorizationHeader() {
    return `Bearer ${await this.getAccessToken()}`
  },

  async getRefreshToken() { return localStorage.getItem('refreshToken') },

  async getRefreshTokenHeader() {
    return `Bearer ${await this.getRefreshToken()}`
  },

  async getAccount() {
    const account = JSON.parse(await localStorage.getItem('account'))
    return account
  },

  async isAuthorized() {
    return !!await this.getAccessToken();
  },

  async signIn({ email, password }) {
    const response = await fetch(`${baseUrl}/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);

    if (data?.accessToken) {
      await Promise.all([
        localStorage.setItem('account', JSON.stringify(data.account)),
        localStorage.setItem('accessToken', data.accessToken),
        localStorage.setItem('refreshToken', data.refreshToken),
      ]);
    }
  },

  async signOut() {
    await Promise.all([
      localStorage.removeItem('account'),
      localStorage.removeItem('accessToken'),
      localStorage.removeItem('refreshToken')
    ]);
  },

  async refreshToken() {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken || refreshToken === 'undefined') {
      throw new Error('Refresh token not found');
    }

    const response = await fetch(`${baseUrl}/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: await this.getAuthorizationHeader(),
        'x-refresh-token': await this.getRefreshTokenHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Error refreshing token');
    }
    const data = await response.json()

    if (data?.accessToken) {
      await Promise.all([
        localStorage.setItem('account', JSON.stringify(data.account)),
        localStorage.setItem('accessToken', data.accessToken),
        localStorage.setItem('refreshToken', data.refreshToken),
      ]);
    }
  },
}

export default Service;