import type { User, UserRepository } from '../domain/user';

export const getUsers = async (repository: UserRepository): Promise<User[]> => {
  const result = await repository.getAll();
  if (result.ok) {
    return result.value;
  } else {
    throw new Error('Failed to fetch users');
  }
};
