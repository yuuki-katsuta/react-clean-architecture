import type { UserApiResponse } from '../adapters/user/interface';
import type { User } from '../domain/user';

export const toUser = (response: UserApiResponse): User => {
  return {
    id: response.id,
    name: response.name,
    avatar: response.avatar,
  };
};
