import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
export const isAuthenticatedUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ApiError(401, "Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    return next(new ApiError(401, "Unauthorized"));
  }
};
