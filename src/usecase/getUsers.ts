import type { UserAdapter } from '../adapters/user/adapter';
import type { User } from '../domain/user';

export type UserRepository = {
  getUsers: () => Promise<User[]>;
};

export const getUsers = async (adapter: UserAdapter): Promise<User[]> => {
  const result = await adapter.getAll();
  if (result.ok) {
    return result.value;
  } else {
    throw new Error('Failed to fetch users');
  }
};
