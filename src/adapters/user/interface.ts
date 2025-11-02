export interface UserApiResponse {
  createdAt: string;
  name: string;
  avatar: string;
  id: string;
}

export type UserApiClient = {
  getUsers: () => Promise<UserApiResponse[]>;
};
