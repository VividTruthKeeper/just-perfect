import jwt from "jsonwebtoken";

export const createToken = (userId: string, email: string): string => {
  return jwt.sign({ userId: userId, email }, process.env.TOKEN_KEY || "", {
    expiresIn: process.env.TOKEN_EXPIRES_IN || "2h",
  });
};
