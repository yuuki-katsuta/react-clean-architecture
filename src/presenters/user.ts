import type { User } from '../domain/user';
import type { UserApiResponse } from '../infra/drivers/user';

export const toUser = (response: UserApiResponse): User => {
  return {
    id: response.id,
    name: response.name,
    avatar: response.avatar,
  };
};
