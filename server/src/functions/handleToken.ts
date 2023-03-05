import jwt, { TokenExpiredError } from "jsonwebtoken";
import { TokenError } from "../errors/token-error";

interface IdecodedTokenType {
  userId: string;
  email: string;
  iat: number;
  exp: number;
  expiresAt: Date;
}

export const handleToken = async (token: any): Promise<any> => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_KEY || "");
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new TokenError();
    }
  }
  if (!(decodedToken instanceof Object)) {
    throw new TokenError();
  }
  console.log(decodedToken);
  return decodedToken as IdecodedTokenType;
};
