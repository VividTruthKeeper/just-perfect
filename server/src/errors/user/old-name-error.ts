import { CustomError } from "../custom-error";

export class OldNameError extends CustomError {
  statusCode = 409;
  reason = "Your new username cannot be the same as your old username";
  field = "name";
  constructor() {
    super("Your new username cannot be the same as your old username");
    Object.setPrototypeOf(this, OldNameError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason, field: this.field }];
  }
}
