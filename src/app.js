import express from "express";
import User from "./model/User.model.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import { securityMiddleware } from "./middlewares/security.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(securityMiddleware());
app.use(
  cors({
    origin: "https://devconnect-frontend-lc8j.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

import authRoutes from "./routes/auth.route.js";
import profileRoutes from "./routes/profile.route.js";
import connectionRoutes from "./routes/connection.route.js";
import userRoutes from "./routes/user.route.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/users", userRoutes);

app.use(globalErrorHandler);
app.use("/api/healthcheck", (req, res) => {
  res.status(200).json({ success: true, message: "Api is working" });
});

export default app;
