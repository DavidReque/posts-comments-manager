import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

const STATUS_MESSAGES: Record<number, string> = {
  0: 'Sin conexión. Verifica tu red e intenta de nuevo.',
  400: 'La solicitud contiene datos incorrectos.',
  401: 'No estás autenticado. Inicia sesión.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  409: 'Hay un conflicto con el estado actual del recurso.',
  422: 'Los datos enviados no son válidos.',
  500: 'Error interno del servidor. Intenta más tarde.',
};

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  readonly lastError = signal<string>('');

  handle(err: HttpErrorResponse): void {
    const message = this.mapToUiMessage(err);
    this.lastError.set(message);
    console.error('[HttpError]', err.status, message);
  }

  private mapToUiMessage(err: HttpErrorResponse): string {
    // mensaje semantico que devuelve el backend en ApiResponse.error
    const backendMessage: string | undefined = err.error?.message;
    if (backendMessage) {
      return backendMessage;
    }

    // fallback por codigo de estado para errores de red o sin cuerpo
    return STATUS_MESSAGES[err.status] ?? 'Ocurrió un error inesperado.';
  }
}
