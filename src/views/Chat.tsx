import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser, selectCurrentUserToken } from "../store/userSlice";
import { User } from "../types";
import chatService from "../services/chat";

function Chat() {
  const token = useSelector(selectCurrentUserToken);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        await chatService.connect(token!);
      } catch (error: any) {
        if (error.message === "User token is invalid") {
          navigate("/login");
        }
        console.error(error);
      }
    })();
  }, []);
  const user = useSelector(selectCurrentUser) as User;
  return <div>{JSON.stringify(user)}</div>;
}

export default Chat;
