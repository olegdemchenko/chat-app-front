import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ActionFunction, redirect } from "react-router-dom";
import { authAPI } from "../../services/auth";
import { store } from "../../store";
import Copyright from "../../components/Copyright";
import AuthForm from "../../components/AuthForm";

export const loginAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const response = await store.dispatch(
    authAPI.endpoints.login.initiate({ username, password }),
  );
  if ("error" in response) {
    return response.error;
  }
  return redirect("/chat");
};

export default function Login() {
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <AuthForm />
      </Box>
      <Copyright />
    </Container>
  );
}
