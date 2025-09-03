import express from "express";
import { isAuthenticatedUser } from "../middlewares/authenticateUser.js";
import {
  matches,
  pendingRequests,
  feed,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/requests/pending", isAuthenticatedUser, pendingRequests);
router.get("/matches", isAuthenticatedUser, matches);
router.get("/feed", isAuthenticatedUser, feed);
export default router;
