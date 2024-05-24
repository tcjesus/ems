import AuthService from './AuthService';

export default async function handleResponse(response, retry) {
  const body = await response.json();
  if (response.ok) {
    return body.data
  }

  if (response.status === 401 && response.statusText === 'Unauthorized' && retry) {
    try {
      await AuthService.refreshToken();
      const response = await retry();

      return response;
    } catch (error) {
    }
  }

  const responseErrros = body.errors;

  const errors = [response.statusText]
  // if resposneErrors is an array
  if (Array.isArray(responseErrros)) {
    responseErrros.forEach((error) => {
      errors.push(error);
    });
  } else if (responseErrros.message) {
    errors.push(responseErrros.message);
  }
  throw new Error(errors.join(', '));
}