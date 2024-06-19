import handleResponse from "./handleResponse";
import AuthService from "./AuthService";
import LocalidadeService from "./LocalidadeService";

const DefaultService = (baseUrl) => {
  const buildHeaders = async () => ({
    'Content-Type': 'application/json',
    Authorization: await AuthService.getAuthorizationHeader(),
    'x-localidade': JSON.stringify(await LocalidadeService.getLocalidade()),
  });

  return {
    async list() {
      const response = await fetch(
        baseUrl,
        { headers: await buildHeaders() }
      );
      return handleResponse(response, () => this.list());
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