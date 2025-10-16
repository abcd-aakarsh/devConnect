import jwt from "jsonwebtoken";
export const generateJwt = (userId) => {
  const id = userId;

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2d" });
};
