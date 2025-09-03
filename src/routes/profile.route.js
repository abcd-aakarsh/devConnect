import express from "express";
import User from "../model/User.model.js";
import { isAuthenticatedUser } from "../middlewares/authenticateUser.js";
import {
  editProfile,
  getMe,
  getUser,
} from "../controllers/profile.controller.js";
import { editProfileSchema } from "../validators/profile.js";
import { validate } from "../middlewares/validateWithZod.js";

const router = express.Router();

router.get("/me", isAuthenticatedUser, getMe);
router.patch(
  "/me/edit",
  isAuthenticatedUser,
  validate(editProfileSchema),
  editProfile
);
router.get("/user/:id", isAuthenticatedUser, getUser);
export default router;
