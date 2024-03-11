import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import validationRules from "./validationRules";

export enum AuthorizationErrors {
  incorrectCredentials = "incorrectCredentials",
  duplicatedUsername = "duplicatedUsername",
  duplicatedEmail = "duplicatedEmail",
}

const authorizationErrorMessages = {
  incorrectCredentials: "Username or password are incorrect",
  duplicatedEmail: "This email has already been used",
  duplicatedUsername: "User with such name already exists",
} as {
  [key in AuthorizationErrors]: string;
};

const affectedFormFields = {
  [AuthorizationErrors.incorrectCredentials]: ["username", "password"],
  [AuthorizationErrors.duplicatedEmail]: ["email"],
  [AuthorizationErrors.duplicatedUsername]: ["username"],
} as { [key in AuthorizationErrors]: ReadonlyArray<keyof FormState> };

type AuthError = { type: AuthorizationErrors } | null;

type AuthFormProps = {
  variant: "login" | "signup";
  authError: AuthError;
  onSubmit: (state: FormState) => void;
};

export type FormState = {
  username: string;
  password: string;
  email: string;
};

function AuthForm({ variant, authError, onSubmit }: AuthFormProps) {
  const submitButtonLabels = {
    login: "Sign In",
    signup: "Sign up",
  };

  const {
    control,
    formState: { isDirty, isValid, errors },
    setError,
    clearErrors,
    handleSubmit,
  } = useForm<FormState>({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!authError) {
      return;
    }
    const { type } = authError;
    affectedFormFields[type].forEach((fieldName) => {
      setError(fieldName, {
        type: "value",
        message: authorizationErrorMessages[type],
      });
    });
    return () => {
      affectedFormFields[type].forEach((fieldName) => clearErrors(fieldName));
    };
  }, [authError]);

  const isSubmitEnabled = isDirty && isValid;
  return (
    <Box component="form" sx={{ mt: 1 }}>
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
            onChange={onChange}
            id="username"
            label="Username"
            name="usernmame"
            error={!!errors.username}
            helperText={errors.username?.message}
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
            onChange={onChange}
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />
      {variant === "signup" && (
        <Controller
          name="email"
          control={control}
          rules={validationRules.email}
          render={({ field: { value, onChange } }) => (
            <TextField
              margin="normal"
              required
              fullWidth
              value={value}
              onChange={onChange}
              name="email"
              label="Email"
              type="email"
              id="email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!isSubmitEnabled}
        onClick={handleSubmit(onSubmit)}
      >
        {submitButtonLabels[variant]}
      </Button>
    </Box>
  );
}

export default AuthForm;
