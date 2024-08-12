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
  updateMessage = "message:update",
  deleteMessage = "message:delete",
  userJoin = "userJoin",
  userLeave = "userLeave",
}
