import React from "react";
import { Navigate } from "react-router-dom";
import Backdrop from "./Backdrop";
import { useProfileQuery } from "../services/auth";

type VerifyProfileProps = {
  children: React.JSX.Element;
};

function VerifyProfile({ children }: VerifyProfileProps) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  const { isFetching, error } = useProfileQuery(token);
  if (isFetching) {
    return <Backdrop isOpen />;
  }
  if (error) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default VerifyProfile;
