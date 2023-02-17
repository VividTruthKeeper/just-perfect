import { CustomError } from "../custom-error";

export class IncorrectPasswordError extends CustomError {
  statusCode = 401;
  reason = "Incorrect password";
  field = "password";
  constructor() {
    super("Incorrect password");
    Object.setPrototypeOf(this, IncorrectPasswordError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason, field: this.field }];
  }
}
