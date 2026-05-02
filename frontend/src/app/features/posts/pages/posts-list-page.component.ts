// pagina para mostrar el listado de posts
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EMPTY, catchError, delay, retry, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { PostCardComponent } from '../components/post-card.component';
import { Post, PostsService } from '../services/posts.service';

@Component({
  selector: 'app-posts-list-page',
  imports: [PostCardComponent, RouterLink],
  template: `
    <main class="min-h-screen bg-slate-50 px-4 py-8">
      <section class="mx-auto max-w-5xl space-y-6">
        <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-medium uppercase tracking-wide text-slate-500">Posts</p>
            <h1 class="mt-2 text-3xl font-bold text-slate-950">Listado de posts</h1>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            @if (authService.isAuthenticated()) {
              <a
                class="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                routerLink="/posts/new"
              >
                Crear post
              </a>
              <button
                class="w-fit rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                type="button"
                (click)="logout()"
              >
                Cerrar sesion
              </button>
            } @else {
              <a
                class="w-fit rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                routerLink="/login"
              >
                Iniciar sesion
              </a>
            }
          </div>
        </header>

        <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <label class="block text-sm font-medium text-slate-700" for="search">
            Buscar por titulo
          </label>
          <input
            class="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
            id="search"
            type="search"
            [value]="search()"
            (input)="search.set($any($event.target).value)"
          />
        </div>

        @if (isLoading()) {
          <div class="grid gap-4 md:grid-cols-2">
            @for (_ of [1, 2, 3, 4]; track $index) {
              <div class="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <div class="h-5 w-20 rounded-full bg-slate-200"></div>
                    <div class="h-5 w-24 rounded bg-slate-200"></div>
                  </div>
                  <div class="h-5 w-3/4 rounded bg-slate-200"></div>
                  <div class="h-4 w-full rounded bg-slate-200"></div>
                  <div class="h-4 w-2/3 rounded bg-slate-200"></div>
                </div>
                <div class="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                  <div class="h-7 w-12 rounded-md bg-slate-200"></div>
                  <div class="h-7 w-14 rounded-md bg-slate-200"></div>
                  <div class="h-7 w-16 rounded-md bg-slate-200"></div>
                </div>
              </div>
            }
          </div>
        } @else if (errorMessage()) {
          <div class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <svg class="mt-0.5 h-5 w-5 shrink-0 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.75-9.25a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z" clip-rule="evenodd"/>
            </svg>
            <div>
              <p class="font-medium text-red-700">Error al cargar posts</p>
              <p class="mt-0.5 text-sm text-red-600">{{ errorMessage() }}</p>
            </div>
          </div>
        } @else if (filteredPosts().length > 0) {
          <div class="grid gap-4 md:grid-cols-2">
            @for (post of filteredPosts(); track post._id) {
              <app-post-card [post]="post" />
            }
          </div>
        } @else {
          <div class="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center">
            <svg class="h-12 w-12 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
            </svg>
            <p class="mt-4 text-base font-medium text-slate-600">
              {{ search() ? 'Sin resultados para "' + search() + '"' : 'No hay posts todavía' }}
            </p>
            <p class="mt-1 text-sm text-slate-400">
              {{ search() ? 'Intenta con otro término de búsqueda.' : 'Comienza creando el primer post.' }}
            </p>
            @if (!search()) {
              <a
                class="mt-5 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                routerLink="/posts/new"
              >
                Crear post
              </a>
            }
          </div>
        }
      </section>
    </main>
  `,
})
export class PostsListPageComponent {
  private readonly postsService = inject(PostsService); // inyeccion de dependencias del servicio de posts
  protected readonly authService = inject(AuthService);

  protected readonly posts = signal<Post[]>([]); // signal para almacenar los posts
  protected readonly search = signal<string>(''); // signal para almacenar el texto de busqueda
  protected readonly isLoading = signal(true); // signal para almacenar el estado de carga
  protected readonly errorMessage = signal(''); // signal para almacenar el mensaje de error

  protected readonly filteredPosts = computed(() => // computed para filtrar los posts basado en el texto de busqueda
    this.posts().filter((post) =>
      post.title.toLowerCase().includes(this.search().toLowerCase()),
    ),
  );

  constructor() {
    this.postsService
      .getPosts()
      .pipe(
        // reintenta hasta 2 veces si la peticion falla
        retry(2),
        // espera minima para que el estado de carga sea visible
        delay(400),
        // actualiza el signal de posts como efecto secundario
        tap((posts) => this.posts.set(posts)),
        // captura el error definitivo tras los reintentos
        catchError(() => {
          this.errorMessage.set('No se pudieron cargar los posts.');
          return EMPTY;
        }),
      )
      .subscribe({
        complete: () => this.isLoading.set(false),
      });
  }

  protected logout(): void {
    this.authService.logout();
  }
}
