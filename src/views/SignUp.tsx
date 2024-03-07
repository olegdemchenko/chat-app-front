import React from "react";
import {
  ActionFunction,
  redirect,
  useSubmit,
  useNavigation,
} from "react-router-dom";
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
import AuthForm, {
  AuthorizationErrors,
  FormState,
} from "../components/AuthForm";
import SocialMediaLinks from "../components/SocialMediaLinks";
import PageLink from "../components/PageLink";
import Backdrop from "../components/Backdrop";

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
  return redirect("/verify_email");
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
  const { state: navigationState } = useNavigation();
  const [signup, { error }] = useSignupMutation({ fixedCacheKey: "signup" });

  const submit = useSubmit();

  const handleSubmit = (state: FormState) => {
    submit(state, {
      method: "POST",
      action: "/signup",
    });
  };

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
          authError={getRelevantAuthError(error)}
          onSubmit={handleSubmit}
        />
        <PageLink href="/login" text="Already have an account? Sign in" />
        <SocialMediaLinks />
        <Copyright />
      </Box>
      <Backdrop isOpen={navigationState === "submitting"} />
    </Container>
  );
}

export default SignUp;
