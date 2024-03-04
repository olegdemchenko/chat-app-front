export type User = {
  name: string;
  email: string;
  isVerified: boolean;
};

export type UserAuthData = {
  user: User;
  token: string;
};
