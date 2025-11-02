import type { UserApiResponse } from '../../adapters/user/interface';
import type { HTTPClient } from '../../libs/http';

export interface Driver {
  getUsers: () => Promise<UserApiResponse[]>;
}

export const createClient = (httpClient: HTTPClient) => {
  const getUsers = async (): Promise<UserApiResponse[]> => {
    const { body } = await httpClient.get<UserApiResponse[]>('/users');
    return body;
  };

  return {
    getUsers,
  };
};
