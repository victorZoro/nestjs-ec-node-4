import { HttpException, HttpStatus } from '@nestjs/common';

// Class derived from: https://github.com/charleslana/nestjs-typescript

export class BusinessRuleException extends HttpException {
  constructor(message: string, statusCode: number = HttpStatus.BAD_REQUEST) {
    super({ message, statusCode: statusCode }, statusCode);
  }
}
