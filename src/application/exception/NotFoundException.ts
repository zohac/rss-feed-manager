// application/exception/NotFoundException.ts

export class NotFoundException extends Error {
  readonly message: string;
  name = 'NotFoundException';

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
