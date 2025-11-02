import type { HTTPClient } from '../../../libs/http';
import type { UserApiResponse } from './types';

export interface UserDriver {
  getAll: () => Promise<UserApiResponse[]>;
}

export const createUserClient = (httpClient: HTTPClient): UserDriver => {
  const getAll = async (): Promise<UserApiResponse[]> => {
    const { body } = await httpClient.get<UserApiResponse[]>('/users');
    return body;
  };

  return {
    getAll,
  };
};
