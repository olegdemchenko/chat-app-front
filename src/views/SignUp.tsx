import React from "react";
import { ActionFunction, redirect } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { authAPI, useSignupMutation } from "../services/auth";
import { store } from "../store";
import Copyright from "../components/Copyright";
import AuthForm, { AuthorizationErrors } from "../components/AuthForm";
import SocialMediaLinks from "../components/SocialMediaLinks";

export const signupAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;
  const response = await store.dispatch(
    authAPI.endpoints.signup.initiate(
      { username, password, email },
      { fixedCacheKey: "signup" },
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
  const [signup, { error }] = useSignupMutation({ fixedCacheKey: "signup" });
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <AuthForm
          variant="signup"
          actionPath="/signup"
          authError={getRelevantAuthError(error)}
        />
        <SocialMediaLinks />
      </Box>
      <Copyright />
    </Container>
  );
}

export default SignUp;
