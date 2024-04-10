import { Socket, io } from "socket.io-client";

class ChatService {
  private socket: null | Socket = null;

  connect(token: string) {
    return new Promise((res, rej) => {
      this.socket = io("ws://localhost:5000", {
        auth: {
          token,
        },
        transports: ["websocket"],
      });
      this.socket.on("connect_error", (error: Error) => {
        console.log("connect error", error.message);
        rej(error);
      });
      this.socket.on("connect", () => {
        console.log("socket connected successfully");
        res(null);
      });
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export default new ChatService();
