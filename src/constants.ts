export const routes = {
  login: "login",
  signup: "signup",
  verifyEmail: "verify_email",
  verificationSuccess: "email_verify_success",
  chat: "chat",
};

export enum ChatEvents {
  connect = "connect",
  joinRooms = "joinRooms",
  leaveRooms = "leaveRooms",
  getUserRooms = "getUserRooms",
  getUserId = "getUserId",
  isUserOnline = "isUserOnline",
  findUsers = "findUsers",
  findRoom = "findRoom",
  connectToRoom = "connectToRoom",
  createRoom = "createRoom",
  deleteRoom = "deleteRoom",
  newRoom = "newRoom",
  newMessage = "newMessage",
  loadMoreMessages = "loadMoreMessages",
  readMessages = "readMessages",
  updateMessage = "updateMessage",
  deleteMessage = "deleteMessage",
  userOnline = "userOnline",
  userOffline = "userOffline",
  customError = "customError",
  connectError = "connect_error",
}

export const MESSAGES_PER_PAGE = 15;
