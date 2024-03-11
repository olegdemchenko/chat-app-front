import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/userSlice";
import { User } from "../types";

function Chat() {
  const user = useSelector(selectCurrentUser) as User;
  return <div>{JSON.stringify(user)}</div>;
}

export default Chat;
