import { Socket, io } from "socket.io-client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Participant, Room } from "../types";
import { RootState } from "../store";
import { ChatEvents } from "../constants";

// class ChatService {
//   private socket: null | Socket = null;

//   connect(token: string) {
//     return new Promise((res, rej) => {
//       this.socket = io("ws://localhost:5000", {
//         auth: {
//           token,
//         },
//         transports: ["websocket"],
//       });
//       this.socket.on("connect_error", (error: Error) => {
//         console.log("connect error", error.message);
//         rej(error);
//       });
//       this.socket.on("connect", () => {
//         console.log("socket connected successfully");
//         res(null);
//       });
//     });
//   }

//   getRooms(): Promise<Room[]> {
//     return new Promise((res) => {
//       this.socket?.emit("getUserRooms", res);
//     });
//   }

//   findUsers(nameFragment: string): Promise<Participant[]> {
//     return new Promise((res) => {
//       this.socket?.emit("findUsers", nameFragment, res);
//     });
//   }

//   createRoom(
//     secondParticipantId: Participant["userId"],
//   ): Promise<Room["roomId"]> {
//     return new Promise((res) => {
//       this.socket?.emit("createRoom", secondParticipantId, res);
//     });
//   }

//   deleteRoom(roomId: Room["roomId"]): Promise<boolean> {
//     return new Promise((res) => {
//       this.socket?.emit("leaveRoom", roomId, res);
//     });
//   }

//   disconnect() {
//     this.socket?.disconnect();
//     this.socket = null;
//   }
// }

// const chatAPI = createApi({
//   reducerPath: "chatAPI",
//   endpoints: (builder) => ({
//     findUsers: builder.query<Participant[], string>({

//     })
//   }),
// });

// export default ChatService;
type SocketService = {
  instance: null | Socket;
  initializeSocket: (url: string, token: string) => Socket;
  getInstance: () => Socket | null;
  removeInstance: () => null;
};

const socketService: SocketService = {
  instance: null,
  initializeSocket(url: string, token: string) {
    this.instance = io(url, {
      auth: {
        token,
      },
      transports: ["websocket"],
    });
    return this.instance;
  },
  getInstance() {
    return this.instance;
  },
  removeInstance() {
    this.instance = null;
    return this.instance;
  },
};

type ConnectionStatus = {
  connected: boolean;
};

const chatAPI = createApi({
  reducerPath: "api/chat",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    connect: builder.query<ConnectionStatus, void>({
      queryFn: () => ({ data: { connected: false } }),
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved, getState },
      ) {
        try {
          await cacheDataLoaded;
          const state = getState() as RootState;
          const socket = socketService.initializeSocket(
            process.env.REACT_APP_CHAT_HOST as string,
            state.user.token?.slice(2) as string,
          );
          socket.on(ChatEvents.connect, () => {
            console.log("socket connected");
            updateCachedData((draft) => {
              draft.connected = true;
            });
          });
          socket.on(ChatEvents.connectError, (e) => {
            console.log("socket connection error", e);
            updateCachedData(() => {});
            throw e;
          });
          await cacheEntryRemoved;
          socket.off("connect");
        } catch (e) {}
      },
    }),
  }),
});

export default chatAPI;

export const { useConnectQuery } = chatAPI;
