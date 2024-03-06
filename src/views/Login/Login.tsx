import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ActionFunction, redirect } from "react-router-dom";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { authAPI, useLoginMutation } from "../../services/auth";
import { store } from "../../store";
import Copyright from "../../components/Copyright";
import AuthForm, { AuthorizationErrors } from "../../components/AuthForm";
import SocialMediaLinks from "../../components/SocialMediaLinks";

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
  const [login, { error }] = useLoginMutation({ fixedCacheKey: "login" });
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LoginIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <AuthForm
          variant="login"
          actionPath="/login"
          authError={getRelevantAuthError(error)}
        />
        <SocialMediaLinks />
      </Box>
      <Copyright />
    </Container>
  );
}
