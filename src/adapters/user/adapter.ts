import { Err, Ok, type Result } from '../../domain/result';
import type { User } from '../../domain/user';
import type { Driver } from '../../infra/drivers/users';
import { toUser } from '../../presenters/user';

export interface UserAdapter {
  getAll: () => Promise<Result<User[]>>;
}

export const createAdapter = (driver: Driver): UserAdapter => {
  const getAll = async (): Promise<Result<User[]>> => {
    try {
      const response = await driver.getUsers();
      const users = response.map(toUser);
      return Ok(users);
    } catch (error) {
      return Err(error);
    }
  };

  return { getAll };
};
