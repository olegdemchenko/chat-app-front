import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/userSlice";

type ProtectedRouteProps = {
  children: React.JSX.Element;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useSelector(selectCurrentUser);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;
