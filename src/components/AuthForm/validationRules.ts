export default {
  username: {
    required: {
      value: true,
      message: "Username is required",
    },
  },
  password: {
    required: {
      value: true,
      message: "Password is required",
    },
  },
  email: {
    pattern: {
      value: /^\w+@\w+\.\w+$/,
      message: "Please, provide a correct email address",
    },
  },
};
