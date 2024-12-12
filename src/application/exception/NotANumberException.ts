// application/exception/NotANumberException.ts

export class NotANumberException extends Error {
  readonly message: string;
  name = 'NotANumberException';

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
