import { TFunction } from "i18next";

export default {
  username: (t: TFunction<"translation", undefined>) => ({
    required: {
      value: true,
      message: t("auth.validation.fieldIsRequired", { field: "username" }),
    },
  }),
  password: (t: TFunction<"translation", undefined>) => ({
    required: {
      value: true,
      message: t("auth.validation.fieldIsRequired", { field: "password" }),
    },
  }),
  email: (t: TFunction<"translation", undefined>) => ({
    pattern: {
      value: /^\w+@\w+\.\w+$/,
      message: t("auth.validation.incorrectEmail"),
    },
  }),
};
