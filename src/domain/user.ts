import type { Result } from './result';

export interface UserRepository {
  getAll: () => Promise<Result<User[]>>;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}
