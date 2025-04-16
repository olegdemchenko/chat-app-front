import React, { useState, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";
import Backdrop from "./Backdrop";
import SocketContext from "contexts/SocketContext";
import { ChatEvents } from "app/constants";
import ProfileContext from "contexts/ProfileContext";
import useThrowOnRender from "hooks/useThrowOnRender";
import { Profile } from "types";

type SocketProviderProps = {
  children: React.JSX.Element;
};

function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { userId } = useContext(ProfileContext) as Profile;
  const throwError = useThrowOnRender();

  useEffect(() => {
    const onConnect = (socket: Socket) => () => {
      setSocket(socket);
    };

    const initConnection = () => {
      const socketInstance = io(process.env.REACT_APP_WS_HOST as string, {
        auth: { userId },
        transports: ["websocket"],
      });
      socketInstance.on(ChatEvents.connect, onConnect(socketInstance));
      socketInstance.on(ChatEvents.connectError, throwError);
      socketInstance.on(ChatEvents.reconnectError, throwError);

      return socketInstance;
    };

    const instance = initConnection();
    return () => {
      instance.disconnect();
    };
  }, []);

  return socket?.connected ? (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  ) : (
    <Backdrop isOpen />
  );
}

export default SocketProvider;
