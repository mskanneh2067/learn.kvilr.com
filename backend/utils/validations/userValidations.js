import { body } from "express-validator";

export const usersValidationSchema = {
  firstName: {
    errorMessage: "First name can only include Alpha Numeric Characters",
    isAlphanumeric: true,
  },
};
