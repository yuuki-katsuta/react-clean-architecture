import type { UserApiResponse } from '../adapters/user/interface';
import type { HTTPClient } from '../infra/http';

export const createUserApiClient = (httpClient: HTTPClient) => {
  const getUsers = async (): Promise<UserApiResponse[]> => {
    const { body } = await httpClient.get<UserApiResponse[]>('/users');
    return body;
  };

  return {
    getUsers,
  };
};
