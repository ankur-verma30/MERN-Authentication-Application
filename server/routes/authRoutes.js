import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetUserPassword,
  sendResetPasswordOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

//creating the endpoint APIs
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.post("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendResetPasswordOtp);
authRouter.post("/reset-password", resetUserPassword);

export default authRouter;
