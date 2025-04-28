export type Profile = {
  username: string;
  email: string;
  userId: string;
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
