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
  userId: string;
  name: string;
  isOnline: boolean;
};
