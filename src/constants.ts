export const routes = {
  login: "login",
  signup: "signup",
  verifyEmail: "verify_email",
  verificationSuccess: "email_verify_success",
  chat: "chat",
};

export enum ChatEvents {
  connect = "connect",
  connectError = "connect_error",
  customError = "customError",
  getUserRooms = "getUserRooms",
  findUsers = "findUsers",
  findRoom = "findRoom",
  connectToRoom = "connectToRoom",
  createRoom = "createRoom",
  leaveRoom = "leaveRoom",
  newRoom = "newRoom",
  message = "message",
  loadMoreMessages = "loadMoreMessages",
  updateMessage = "updateMessage",
  deleteMessage = "deleteMessage",
  readMessages = "readMessages",
  userJoin = "userJoin",
  userLeave = "userLeave",
  getUserId = "getUserId",
}

export const MESSAGES_PER_PAGE = 15;
