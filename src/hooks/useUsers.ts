import { useEffect, useState } from 'react';
import { createAdapter } from '../adapters/user/adapter';
import type { User } from '../domain/user';
import { httpClient } from '../infra/client';
import { createClient } from '../infra/drivers/users';
import { getUsers } from '../usecase/getUsers';

const client = createClient(httpClient);
const adapter = createAdapter(client);

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const users = await getUsers(adapter);
      return users;
    };

    fetch()
      .then(result => {
        setUsers(result);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    users,
    isLoading,
    isError,
  };
};
