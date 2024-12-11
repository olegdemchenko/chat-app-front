import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Navigate } from "react-router-dom";
import Chat from "./Chat";
import Backdrop from "../components/Backdrop";
import { ChatEvents, routes } from "../constants";
import { useSelector } from "react-redux";
import { selectCurrentUserToken } from "../store/userSlice";

function SocketProvider() {
  const token = useSelector(selectCurrentUserToken);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const onConnect = (socket: Socket) => () => {
      setIsConnecting(false);
      setSocket(socket);
    };

    const onError = (error: Error) => {
      setIsConnecting(false);
      setError(error);
    };

    const initConnection = () => {
      setIsConnecting(true);
      const socketInstance = io(process.env.REACT_APP_CHAT_HOST as string, {
        auth: {
          token,
        },
        transports: ["websocket"],
      });
      socketInstance.on(ChatEvents.connect, onConnect(socketInstance));
      socketInstance.on(ChatEvents.connectError, onError);
      socketInstance.on(ChatEvents.customError, onError);

      return socketInstance;
    };

    const instance = initConnection();
    return () => {
      instance.disconnect();
    };
  }, []);

  switch (true) {
    case Boolean(isConnecting): {
      return <Backdrop isOpen />;
    }
    case error && error.message === "User token is invalid": {
      return <Navigate to={`/${routes.login}`} />;
    }
    case Boolean(error): {
      console.log(error);
      throw error;
    }
    case socket !== null: {
      return <Chat socket={socket as Socket} />;
    }
    default:
      return null;
  }
}

export default SocketProvider;
