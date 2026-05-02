import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AutofocusDirective } from '../../../shared/directives/autofocus.directive';

@Component({ // componente para la pagina de login
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, AutofocusDirective],
  template: `
    <main class="min-h-screen bg-slate-50 px-4 py-8">
      <section class="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-bold text-slate-900">Iniciar sesion</h1>
        <p class="mt-1 text-sm text-slate-500">Ingresa tus credenciales para continuar.</p>

        <form class="mt-6 space-y-4" [formGroup]="loginForm" (ngSubmit)="login()">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-700" for="username">Usuario</label>
            <input
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
              id="username"
              type="text"
              formControlName="username"
              appAutofocus
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-700" for="password">Contrasena</label>
            <input
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
              id="password"
              type="password"
              formControlName="password"
            />
          </div>

          @if (errorMessage()) {
            <p class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ errorMessage() }}</p>
          }

          <button
            class="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            type="submit"
            [disabled]="isSubmitting()"
          >
            {{ isSubmitting() ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

        <a class="mt-4 inline-block text-sm font-medium text-slate-600 hover:text-slate-900" routerLink="/posts">
          Volver a posts
        </a>
      </section>
    </main>
  `,
})
export class LoginPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  protected login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => void this.router.navigate(['/posts']),
      error: () => {
        this.errorMessage.set('Credenciales invalidas.');
        this.isSubmitting.set(false);
      },
    });
  }
}
