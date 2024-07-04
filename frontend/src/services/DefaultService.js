import handleResponse from "./handleResponse";
import AuthService from "./AuthService";
import LocalidadeService from "./LocalidadeService";

const DefaultService = (baseUrl) => {
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

  return {
    async list(filters = {}) {
      const queryParams = buildQueryParams(filters);

      const response = await fetch(
        `${baseUrl}?${queryParams}`,
        { headers: await buildHeaders() }
      );
      return handleResponse(response, () => this.list(filters));
    },

    async get(id) {
      const response = await fetch(
        `${baseUrl}/${id}`,
        { headers: await buildHeaders() }
      );
      return handleResponse(response, () => this.get(id));
    },

    async save(record) {
      const _record = { ...record };
      Object.keys(_record).forEach(key => {
        if (_record[key] === '') {
          _record[key] = null;
        }
      })

      if (_record.id) {
        return this.edit(_record.id, _record);
      }
      return this.create(_record);
    },

    async create(record) {
      const response = await fetch(
        baseUrl,
        {
          method: 'POST',
          headers: await buildHeaders(),
          body: JSON.stringify(record),
        }
      );

      return handleResponse(response, () => this.create(record));
    },

    async edit(id, record) {
      const response = await fetch(
        `${baseUrl}/${id}`,
        {
          method: 'PUT',
          headers: await buildHeaders(),
          body: JSON.stringify(record),
        }
      );

      return handleResponse(response, () => this.edit(id, record));
    },

    async delete(id) {
      const response = await fetch(
        `${baseUrl}/${id}`,
        {
          method: 'DELETE',
          headers: await buildHeaders(),
        }
      );

      return handleResponse(response, () => this.delete(id));
    },
  }
}

export default DefaultService;