import { Err, Ok, type Result } from '../../domain/result';
import type { User, UserRepository } from '../../domain/user';
import type { Driver } from '../../infra/drivers/users';
import { toUser } from '../../presenters/user';

export const createAdapter = (client: Driver): UserRepository => {
  const getAll = async (): Promise<Result<User[]>> => {
    try {
      const response = await client.getUsers();
      const users = response.map(toUser);
      return Ok(users);
    } catch (error) {
      return Err(error);
    }
  };

  return { getAll };
};
