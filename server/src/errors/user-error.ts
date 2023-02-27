import { CustomError } from "./custom-error";

export class UserError extends CustomError {
  statusCode = 409;
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, UserError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
