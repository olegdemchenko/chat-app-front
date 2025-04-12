import React from "react";
import { Navigate } from "react-router-dom";
import Backdrop from "./Backdrop";
import ProfileContext from "../contexts/ProfileContext";
import { useProfileQuery } from "../services/auth";
import { Profile } from "../types";

type ProfileProviderProps = {
  children: React.JSX.Element;
};

function ProfileProvider({ children }: ProfileProviderProps) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  const { data: profile, isFetching, error } = useProfileQuery(token);
  if (isFetching) {
    return <Backdrop isOpen />;
  }
  if (error) {
    return <Navigate to="/login" />;
  }
  return (
    <ProfileContext.Provider value={profile as Profile}>
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileProvider;
