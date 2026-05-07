import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Capture exception with Sentry if it's a 500 error or not an HttpException
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status >= 500 || !isHttpException) {
      Sentry.captureException(exception);
    }

    const errorResponse = exception.getResponse
      ? exception.getResponse()
      : { message: exception.message, statusCode: status };

    const message =
      typeof errorResponse === 'object' && 'message' in errorResponse
        ? errorResponse.message
        : errorResponse;

    const error =
      typeof errorResponse === 'object' && 'error' in errorResponse
        ? errorResponse.error
        : status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal Server Error'
          : undefined;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: Array.isArray(message) ? message[0] : message,
      error,
    });
  }
}
