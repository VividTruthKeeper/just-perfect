import { CustomError } from "../custom-error";

export class AlreadyExistsError extends CustomError {
  statusCode = 409;
  reason = "User with this email already exists";
  field = "email";
  constructor() {
    super("User with this email already exists");
    Object.setPrototypeOf(this, AlreadyExistsError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason, field: this.field }];
  }
}
