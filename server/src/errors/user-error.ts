import { CustomError } from "./custom-error";

export class UserError extends CustomError {
  statusCode: number;
  message: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, UserError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
