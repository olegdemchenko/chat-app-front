import React from "react";
import Avatar from "@mui/material/Avatar";
import LoginIcon from "@mui/icons-material/Login";
import Typography from "@mui/material/Typography";
import {
  ActionFunction,
  redirect,
  useSubmit,
  useNavigation,
} from "react-router-dom";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { authAPI, useLoginMutation } from "../../services/auth";
import { store } from "../../store";
import Copyright from "../../components/Copyright";
import AuthForm, {
  AuthorizationErrors,
  FormState,
} from "../../components/AuthForm";
import SocialMediaLinks from "../../components/SocialMediaLinks";
import PageLink from "../../components/PageLink";
import Backdrop from "../../components/Backdrop";
import CenteringContainer from "../../components/CenteringContainer";

export const loginAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const response = await store.dispatch(
    authAPI.endpoints.login.initiate(
      { username, password },
      { fixedCacheKey: "login" },
    ),
  );
  if ("error" in response) {
    return response.error;
  }
  return redirect("/chat");
};

const getRelevantAuthError = (
  error: FetchBaseQueryError | SerializedError | undefined,
) => {
  const isUserNotFound = error && "status" in error && error.status === 404;
  if (isUserNotFound) {
    return { type: AuthorizationErrors.incorrectCredentials };
  }
  return null;
};

export default function Login() {
  const { state: navigationState } = useNavigation();
  const [login, { error }] = useLoginMutation({ fixedCacheKey: "login" });

  const submit = useSubmit();

  const handleSubmit = (state: FormState) => {
    submit(state, {
      method: "POST",
      action: "/login",
    });
  };

  return (
    <CenteringContainer>
      <Avatar sx={{ mb: 1, bgcolor: "primary.main" }}>
        <LoginIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <AuthForm
        variant="login"
        authError={getRelevantAuthError(error)}
        onSubmit={handleSubmit}
      />
      <PageLink href="/signup" text={`Don't have an account? Sign Up`} />
      <SocialMediaLinks />
      <Copyright />
      <Backdrop isOpen={navigationState === "submitting"} />
    </CenteringContainer>
  );
}
