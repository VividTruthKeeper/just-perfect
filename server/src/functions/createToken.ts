import jwt from "jsonwebtoken";

export default async (email: string): Promise<string> => {
  return jwt.sign({ email }, process.env.TOKEN_KEY || "", {
    expiresIn: process.env.TOKEN_EXPIRES_IN || "2h",
  });
};
