import React from "react";
import { Navigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useTranslation } from "react-i18next";
import { useSignupMutation } from "../services/auth";
import Copyright from "../components/Copyright";
import AuthForm, { AuthorizationErrors } from "../components/AuthForm";
import SocialMediaLinks from "../components/SocialMediaLinks";
import PageLink from "../components/PageLink";
import Backdrop from "../components/Backdrop";
import CenteringContainer from "../components/CenteringContainer";
import { routes } from "../constants";

const getRelevantAuthError = (
  error: FetchBaseQueryError | SerializedError | undefined,
) => {
  const isUsernameTaken = error && "status" in error && error.status === 401;
  const isEmailTaken = error && "status" in error && error.status === 409;
  switch (true) {
    case isEmailTaken: {
      return { type: AuthorizationErrors.duplicatedEmail };
    }
    case isUsernameTaken: {
      return { type: AuthorizationErrors.duplicatedUsername };
    }
    default:
      return null;
  }
};

function SignUp() {
  const { t } = useTranslation();
  const [signup, { data, error, isLoading }] = useSignupMutation();

  if (data) {
    return <Navigate to={`/${routes.verifyEmail}`} />;
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
      <SocialMediaLinks />
      <Copyright />
      <Backdrop isOpen={isLoading} />
    </CenteringContainer>
  );
}

export default SignUp;
