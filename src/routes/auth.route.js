import express from "express";
import {
  forgotPassword,
  login,
  logout,
  signUp,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validateWithZod.js";
import {
  forgotPasswordSchema,
  loginSchema,
  signUpSchema,
} from "../validators/auth.js";
import { isAuthenticatedUser } from "../middlewares/authenticateUser.js";
import User from "../model/User.model.js";
import ApiError from "../utils/ApiError.js";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signUp);
router.post("/login", validate(loginSchema), login);
router.post("/logout", isAuthenticatedUser, logout);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
// router.get("/profile", isAuthenticatedUser, async (req, res) => {
//   try {
//     const user = await User.findById(req.user);
//     if (!user) {
//       throw new ApiError(404, "User not found");
//     }
//     res.status(200).json({ user });
//   } catch (error) {
//     next(error);
//   }
// });
export default router;
