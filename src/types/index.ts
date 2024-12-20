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

export type Message = {
  messageId: string;
  author: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  readBy: string[];
};

export type Room = {
  roomId: string;
  participants: Participant[];
  messages: Message[];
  messagesCount: number;
  unreadMessagesCount: number;
};
