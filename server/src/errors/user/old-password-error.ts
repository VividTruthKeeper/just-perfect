import { CustomError } from "../custom-error";

export class OldPasswordError extends CustomError {
  statusCode = 409;
  reason = "Your new password cannot be the same as your old password";
  field = "password";
  constructor() {
    super("Your new password cannot be the same as your old password");
    Object.setPrototypeOf(this, OldPasswordError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason, field: this.field }];
  }
}
