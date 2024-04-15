import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUserToken } from "../../store/userSlice";
import chatService from "../../services/chat";
import Content from "./Content";

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
  return <Content />;
}

export default Chat;
