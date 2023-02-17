import { CustomError } from "../custom-error";

export class TokenRequiredError extends CustomError {
  statusCode = 401;
  reason = "Token is required";
  constructor() {
    super("Token is required");
    Object.setPrototypeOf(this, TokenRequiredError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
