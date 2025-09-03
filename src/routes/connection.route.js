import express from "express";
import { isAuthenticatedUser } from "../middlewares/authenticateUser.js";
import {
  acceptConnection,
  passConnection,
  rejectConnection,
  sendConnectionRequest,
} from "../controllers/connection.controller.js";

const router = express.Router();

router.post("/request/:toUserId", isAuthenticatedUser, sendConnectionRequest);
router.post("/pass/:toUserId", isAuthenticatedUser, passConnection);
router.post("/accept/:requestId", isAuthenticatedUser, acceptConnection);
router.post("/reject/:requestId", isAuthenticatedUser, rejectConnection);
export default router;
