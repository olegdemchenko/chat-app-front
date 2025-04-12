import React from "react";
import Avatar from "@mui/material/Avatar";
import LoginIcon from "@mui/icons-material/Login";
import Typography from "@mui/material/Typography";
import { Navigate } from "react-router-dom";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useTranslation } from "react-i18next";
import { useSignInMutation } from "../services/auth";
import Copyright from "../components/Copyright";
import AuthForm, { AuthorizationErrors } from "../components/AuthForm";
//import SocialMediaLinks from "../components/SocialMediaLinks";
import PageLink from "../components/PageLink";
import Backdrop from "../components/Backdrop";
import CenteringContainer from "../components/CenteringContainer";
import { routes } from "../constants";

const getRelevantAuthError = (
  error: FetchBaseQueryError | SerializedError | undefined,
) => {
  const isUserNotFound = error && "status" in error && error.status === 401;
  if (isUserNotFound) {
    return { type: AuthorizationErrors.incorrectCredentials };
  }
  if (error && !isUserNotFound) {
    throw error;
  }
  return null;
};

export default function Login() {
  const [login, { data, error, isLoading }] = useSignInMutation();
  const { t } = useTranslation();

  if (data) {
    localStorage.setItem("access_token", data.access_token);
    return <Navigate to="/" />;
  }

  return (
    <CenteringContainer>
      <Avatar sx={{ mb: 1, bgcolor: "primary.main" }}>
        <LoginIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {t("auth.signin")}
      </Typography>
      <AuthForm
        variant="login"
        authError={getRelevantAuthError(error)}
        onSubmit={login}
      />
      <PageLink href={`/${routes.signup}`} text={t("auth.signupLink")} />
      {/* TODO finish auth via social networks */}
      {/* <SocialMediaLinks /> */}
      <Copyright />
      <Backdrop isOpen={isLoading} />
    </CenteringContainer>
  );
}
