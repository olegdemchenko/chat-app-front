import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useSubmit, useActionData } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import validationRules from "./validationRules";

type FormState = {
  username: string;
  password: string;
};

function AuthForm() {
  const {
    control,
    formState: { isDirty, isValid, errors },
    getValues,
    setError,
    clearErrors,
  } = useForm<FormState>({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const error = useActionData() as FetchBaseQueryError;

  useEffect(() => {
    if (error && error.status === 404) {
      setError("root", { message: "Username or password are incorrect" });
    }
  }, [error]);

  const submit = useSubmit();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(getValues(), {
      method: "POST",
      action: "/login",
    });
  };

  const isSubmitEnabled = isDirty && isValid;
  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
      <Controller
        name="username"
        control={control}
        rules={validationRules.username}
        render={({ field: { value, onChange } }) => (
          <TextField
            margin="normal"
            required
            fullWidth
            value={value}
            onChange={(e) => {
              clearErrors("root");
              onChange(e);
            }}
            id="username"
            label="Username"
            name="usernmame"
            error={!!errors.root || !!errors.username}
            helperText={errors.root?.message || errors.username?.message}
            autoFocus
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={validationRules.password}
        render={({ field: { value, onChange } }) => (
          <TextField
            margin="normal"
            required
            fullWidth
            value={value}
            onChange={(e) => {
              clearErrors("root");
              onChange(e);
            }}
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={!!errors.root || !!errors.password}
            helperText={errors.root?.message || errors.password?.message}
          />
        )}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!isSubmitEnabled}
      >
        Sign In
      </Button>
      <Grid container justifyContent="center">
        <Grid item>
          <Link href="/" variant="body2">
            {`Don't have an account? Sign Up`}
          </Link>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" gap={3} sx={{ mt: 2 }}>
        <Grid item>
          <FacebookIcon color="primary" sx={{ fontSize: 45 }} />
        </Grid>
        <Grid item>
          <GoogleIcon color="error" sx={{ fontSize: 45 }} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AuthForm;
