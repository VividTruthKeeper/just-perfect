import { CustomError } from "./custom-error";

export class TokenError extends CustomError {
  statusCode = 401;
  reason = "Token is either expired, invalid, or was not provided";
  constructor() {
    super("Token is either expired, invalid, or was not provided");
    Object.setPrototypeOf(this, TokenError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
