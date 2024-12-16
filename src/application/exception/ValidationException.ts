// application/exception/ValidationException.ts

export class ValidationException extends Error {
  readonly message: string;
  name = 'ValidationException';

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
