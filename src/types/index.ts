export type User = {
  name: string;
  email: string;
  isVerified: boolean;
};

export type UserAuthData = {
  user: User;
  token: string;
};

export type Participant = {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
};
