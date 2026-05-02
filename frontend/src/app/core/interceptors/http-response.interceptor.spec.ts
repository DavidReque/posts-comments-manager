// prueba para el interceptor de respuestas exitosas
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { httpResponseInterceptor } from './http-response.interceptor';

describe('httpResponseInterceptor', () => {
  it('desempaqueta respuestas exitosas con formato ApiResponse', async () => { // prueba para verificar que se desempaqueta respuestas exitosas con formato ApiResponse
    // verifica que se desempaqueta respuestas exitosas con formato ApiResponse
    const request = new HttpRequest('GET', '/api/posts');
    const response = new HttpResponse({
      body: {
        success: true,
        message: 'OK',
        data: [{ id: 1 }],
      },
    });

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(httpResponseInterceptor(request, () => of(response))),
    );

    expect(result).toBeInstanceOf(HttpResponse);
    expect((result as HttpResponse<unknown>).body).toEqual([{ id: 1 }]);
  });

  it('deja intactas las respuestas sin formato ApiResponse', async () => { // prueba para verificar que se dejan intactas las respuestas sin formato ApiResponse
    // verifica que se dejan intactas las respuestas sin formato ApiResponse
    const request = new HttpRequest('GET', '/external');
    const body = { items: [1, 2, 3] };
    const response = new HttpResponse({ body });

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(httpResponseInterceptor(request, () => of(response))),
    );

    expect((result as HttpResponse<unknown>).body).toBe(body);
  });
});
