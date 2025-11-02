import { Err, Ok, type Result } from '../../domain/result';
import type { User } from '../../domain/user';
import { toUser } from '../../presenters/user';
import type { UserApiClient } from './interface';

export interface UserAdapter {
  getAll: () => Promise<Result<User[]>>;
}

export const createUserAdapter = (apiClient: UserApiClient) => {
  const getAll = async (): Promise<Result<User[]>> => {
    try {
      const response = await apiClient.getUsers();
      const users = response.map(toUser);
      return Ok(users);
    } catch (error) {
      return Err(error);
    }
  };

  return { getAll };
};
