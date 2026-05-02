import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { httpResponseInterceptor } from '../interceptors/http-response.interceptor';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpResponseInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('guarda el token al iniciar sesion correctamente', () => {
    authService.login({ username: 'admin', password: 'secret' }).subscribe();

    const request = httpTestingController.expectOne('/api/auth/login');
    expect(request.request.method).toBe('POST');
    request.flush({
      success: true,
      message: 'Autenticacion exitosa',
      data: { accessToken: 'jwt-token' },
    });

    expect(authService.getToken()).toBe('jwt-token');
    expect(localStorage.getItem('auth_token')).toBe('jwt-token');
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('elimina el token al cerrar sesion', () => {
    localStorage.setItem('auth_token', 'jwt-token');
    authService = TestBed.inject(AuthService);

    authService.logout();

    expect(authService.getToken()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
  });
});
