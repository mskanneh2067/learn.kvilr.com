import express from "express";
// import { checkSchema } from "express-validator";
// import { usersValidationSchema } from "../utils/validations/userValidations.js";
import {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
} from "../../controllers/auth/Auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot_password", forgotPassword);
router.patch("/reset_password/:token", resetPassword);

export default router;
