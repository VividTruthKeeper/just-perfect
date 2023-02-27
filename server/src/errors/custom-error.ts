interface ICustomError {
  statusCode: number;
  serializeErrors(): { message: string; field?: string }[];
}

export abstract class CustomError extends Error implements ICustomError {
  abstract statusCode: ICustomError["statusCode"];

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
