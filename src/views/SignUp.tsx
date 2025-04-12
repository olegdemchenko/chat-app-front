import React from "react";
import { Navigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useTranslation } from "react-i18next";
import { useSignUpMutation } from "../services/auth";
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
  const areCredentialsTaken =
    error && "status" in error && error.status === 409;
  if (areCredentialsTaken) {
    return { type: AuthorizationErrors.duplicatedCredentials };
  }
  if (error && !areCredentialsTaken) {
    throw error;
  }
  return null;
};

function SignUp() {
  const { t } = useTranslation();
  const [signup, { data, error, isLoading }] = useSignUpMutation();

  if (data) {
    localStorage.setItem("access_token", data.access_token);
    return <Navigate to="/" />;
    // TODO add email verification
    //return <Navigate to={`/${routes.verifyEmail}`} />;
  }

  return (
    <CenteringContainer>
      <Avatar sx={{ mb: 1, bgcolor: "primary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {t("auth.signup")}
      </Typography>
      <AuthForm
        variant="signup"
        authError={getRelevantAuthError(error)}
        onSubmit={signup}
      />
      <PageLink href={`/${routes.login}`} text={t("auth.signinLink")} />
      {/* TODO finish auth via social networks */}
      {/* <SocialMediaLinks /> */}
      <Copyright />
      <Backdrop isOpen={isLoading} />
    </CenteringContainer>
  );
}

export default SignUp;
