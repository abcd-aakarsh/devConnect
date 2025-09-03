import express from "express";
import { isAuthenticatedUser } from "../middlewares/authenticateUser.js";
import { matches, pendingRequests } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/requests/pending", isAuthenticatedUser, pendingRequests);
router.get("/matches", isAuthenticatedUser, matches);
export default router;
