import { useEffect, useState } from 'react';
import { createUserAdapter } from '../adapters/user/adapter';
import { createUserApiClient } from '../api/user';
import type { User } from '../domain/user';
import { createHTTPClient } from '../infra/http';
import { getUsers } from '../usecase/getUsers';

const httpClient = createHTTPClient(import.meta.env.VITE_BASE_URL);
const apiClient = createUserApiClient(httpClient);
const adapter = createUserAdapter(apiClient);

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      return await getUsers(adapter);
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
