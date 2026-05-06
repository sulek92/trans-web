import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = exception.getResponse
      ? exception.getResponse()
      : { message: exception.message, statusCode: status };

    const message =
      typeof errorResponse === 'object' && 'message' in errorResponse
        ? (errorResponse as any).message
        : errorResponse;

    const error =
      typeof errorResponse === 'object' && 'error' in errorResponse
        ? (errorResponse as any).error
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
