/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class DefaultExceptionsFilter implements ExceptionFilter {
  private loggerService: Logger;

  constructor() {
    this.loggerService = new Logger();
  }

  parseMessages(messages: string[]) {
    return messages.reduce((acc: any, cur: string) => {
      const key = cur.split(' ').shift();
      const hasKey = Object.keys(acc).includes(key);

      if (!hasKey) {
        acc[key] = [];
      }

      acc[key].push(cur.replace(key, '').slice(1));
      return acc;
    }, {});
  }

  checkIfLogsMustBeDisplayed(status: number, message: string | string[]): string | null {
    if (status === 500 && process.env.NODE_ENV === 'production') {
      return 'Internal server error.';
    }
    return typeof message === 'object' ? this.parseMessages(message) : message;
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const body: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            message: exception.stack,
          };

    if (status === 500) {
      this.loggerService.error(exception.stack);
    }

    response.status(status).send({
      errors: this.checkIfLogsMustBeDisplayed(status, body.message),
    });
  }
}
