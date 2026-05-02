import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface LoginResponse {
  accessToken: string;
}

const TOKEN_STORAGE_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tokenSignal = signal<string | null>(null);

  readonly isAuthenticated = computed(() => Boolean(this.tokenSignal()));

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.tokenSignal.set(localStorage.getItem(TOKEN_STORAGE_KEY));
    }
  }

  // metodo para iniciar sesion
  login(credentials: { username: string; password: string }) {
    return this.http
      .post<ApiResponse<LoginResponse>>('/api/auth/login', credentials)
      .pipe(map((response) => this.setToken(response.data.accessToken)));
  }

  // metodo para cerrar sesion
  logout(): void {
    this.setToken(null);
  }

  // metodo para obtener el token
  getToken(): string | null {
    return this.tokenSignal();
  }

  // metodo para establecer el token
  private setToken(token: string | null): void {
    this.tokenSignal.set(token);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      return;
    }

    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}
