// filtro para manejar las excepciones globales
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../utils/api-response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    response.status(status).json(ApiResponse.error(message, status));
  }

  // metodo para obtener el status de la excepcion
  private getStatus(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  // metodo para obtener el mensaje de la excepcion
  private getMessage(exception: unknown) {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return response;
      }

      if (this.hasMessage(response)) {
        return Array.isArray(response.message)
          ? response.message.join(', ')
          : response.message;
      }
    }

    if (exception instanceof Error && exception.message) {
      return exception.message;
    }

    return 'Error interno del servidor';
  }

  // metodo para validar si el response tiene un mensaje
  private hasMessage(response: unknown): response is { message: string | string[] } {
    return (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    );
  }
}
