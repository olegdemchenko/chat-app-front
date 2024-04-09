import { Socket, io } from "socket.io-client";

class ChatService {
  private socket: null | Socket = null;

  connect(token: string) {
    this.socket = io("ws://localhost:5000", {
      auth: {
        token,
      },
      transports: ["websocket"],
    });
    this.socket.on("connect", () =>
      console.log("socket connected successfully"),
    );
    this.socket.on("connect_error", (error: Error) => {
      console.log("connect error", error.message);
    });
    this.socket.on("disconnect", (reason: string) => {
      console.log("disconnect");
      console.log("reason", reason);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export default new ChatService();
