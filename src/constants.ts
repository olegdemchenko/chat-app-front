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
  userJoin = "userJoin",
  userLeave = "userLeave",
}
