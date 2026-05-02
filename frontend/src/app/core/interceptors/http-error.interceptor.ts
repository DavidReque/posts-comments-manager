import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';

// interceptor para manejar los errores de la aplicacion
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService); // inyeccion de dependencias del servicio de errores

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      errorService.handle(err);
      return throwError(() => err);
    }),
  );
};
