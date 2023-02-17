import jwt, { TokenExpiredError } from "jsonwebtoken";
import { TokenInvalidError } from "../errors/user/token-invalid-error";

interface IdecodedTokenType {
  userId: string;
  email: string;
  iat: number;
  exp: number;
  expiresAt: Date;
}

export const authVerify = async (token: any): Promise<any> => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_KEY || "");
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new TokenInvalidError();
    }
  }
  if (!(decodedToken instanceof Object)) {
    throw new TokenInvalidError();
  }
  if (!("userId" in decodedToken)) {
    throw new TokenInvalidError();
  }
  return decodedToken as IdecodedTokenType;
};
