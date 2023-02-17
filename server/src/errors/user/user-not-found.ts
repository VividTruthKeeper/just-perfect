import { CustomError } from "../custom-error";

export class UserNotFound extends CustomError {
  statusCode = 404;
  reason = "User not found";
  constructor() {
    super("User not found");
    Object.setPrototypeOf(this, UserNotFound.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
