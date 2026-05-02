import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

// interceptor para normalizar respuestas exitosas envueltas por ApiResponse del backend
export const httpResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (!(event instanceof HttpResponse)) {
        return event;
      }

      const body = event.body;
      if (!isSuccessfulApiEnvelope(body)) {
        return event;
      }

      return event.clone({ body: body.data });
    }),
  );
};

// funcion para verificar si la respuesta es exitosa
function isSuccessfulApiEnvelope(body: unknown): body is { success: true; data: unknown } {
  return (
    typeof body === 'object' &&
    body !== null &&
    (body as { success: unknown }).success === true &&
    'data' in body
  );
}
