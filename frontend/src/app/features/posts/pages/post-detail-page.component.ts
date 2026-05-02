// pagina para mostrar el detalle de un post
import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, catchError, forkJoin, map, retry, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CommentsListComponent } from '../components/comments-list.component';
import { Post, PostComment, PostsService } from '../services/posts.service';

@Component({
  selector: 'app-post-detail-page',
  imports: [CommentsListComponent, DatePipe, ReactiveFormsModule, RouterLink],
  template: `
    <main class="min-h-screen bg-slate-50 px-4 py-8">
      <section class="mx-auto max-w-4xl space-y-6">
        <a class="text-sm font-medium text-slate-600 hover:text-slate-950" routerLink="/posts">
          Volver al listado
        </a>

        @if (isLoading()) {
          <div class="animate-pulse space-y-6">
            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div class="space-y-4">
                <div class="h-4 w-20 rounded-full bg-slate-200"></div>
                <div class="h-8 w-2/3 rounded bg-slate-200"></div>
                <div class="flex gap-4">
                  <div class="h-4 w-36 rounded bg-slate-200"></div>
                  <div class="h-4 w-36 rounded bg-slate-200"></div>
                </div>
                <div class="space-y-2 pt-2">
                  <div class="h-4 w-full rounded bg-slate-200"></div>
                  <div class="h-4 w-full rounded bg-slate-200"></div>
                  <div class="h-4 w-3/4 rounded bg-slate-200"></div>
                </div>
              </div>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div class="h-6 w-36 rounded bg-slate-200"></div>
              <div class="mt-4 space-y-3">
                @for (_ of [1, 2]; track $index) {
                  <div class="rounded-lg border border-slate-200 p-4 space-y-2">
                    <div class="h-4 w-32 rounded bg-slate-200"></div>
                    <div class="h-4 w-full rounded bg-slate-200"></div>
                  </div>
                }
              </div>
            </div>
          </div>
        } @else if (errorMessage()) {
          <div class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <svg class="mt-0.5 h-5 w-5 shrink-0 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.75-9.25a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z" clip-rule="evenodd"/>
            </svg>
            <div>
              <p class="font-medium text-red-700">Error al cargar el post</p>
              <p class="mt-0.5 text-sm text-red-600">{{ errorMessage() }}</p>
              <a class="mt-2 inline-block text-sm font-medium text-red-700 underline hover:text-red-900" routerLink="/posts">
                Volver al listado
              </a>
            </div>
          </div>
        } @else if (post(); as post) {
          <article class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <header class="space-y-3">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div class="space-y-3">
                  <p class="text-sm font-medium uppercase tracking-wide text-slate-500">
                    {{ post.author }}
                  </p>
                  <h1 class="text-3xl font-bold text-slate-950">{{ post.title }}</h1>
                </div>
                @if (authService.isAuthenticated()) {
                  <a
                    class="w-fit rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    [routerLink]="['/posts', post._id, 'edit']"
                  >
                    Editar
                  </a>
                }
              </div>
              <div class="flex flex-wrap gap-3 text-sm text-slate-500">
                <time [dateTime]="post.createdAt">
                  Creado: {{ post.createdAt | date: 'medium' }}
                </time>
                <time [dateTime]="post.updatedAt">
                  Actualizado: {{ post.updatedAt | date: 'medium' }}
                </time>
              </div>
            </header>

            <p class="mt-6 whitespace-pre-line text-slate-700">{{ post.body }}</p>
          </article>

          <section class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 class="text-2xl font-semibold text-slate-900">Crear comentario</h2>

            @if (authService.isAuthenticated()) {
              <form class="mt-5 space-y-4" [formGroup]="commentForm" (ngSubmit)="createComment(post._id)">
                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-700" for="name">Nombre</label>
                    <input
                      class="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
                      id="name"
                      type="text"
                      formControlName="name"
                    />
                    @if (isCommentInvalid('name')) {
                      <p class="text-sm text-red-600">El nombre es requerido.</p>
                    }
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-700" for="email">Email</label>
                    <input
                      class="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
                      id="email"
                      type="email"
                      formControlName="email"
                    />
                    @if (isCommentInvalid('email')) {
                      <p class="text-sm text-red-600">Ingresa un email valido.</p>
                    }
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-700" for="comment-body">Comentario</label>
                  <textarea
                    class="min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
                    id="comment-body"
                    formControlName="body"
                  ></textarea>
                  @if (isCommentInvalid('body')) {
                    <p class="text-sm text-red-600">El comentario es requerido.</p>
                  }
                </div>

                @if (commentError()) {
                  <p class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ commentError() }}</p>
                }

                <button
                  class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  type="submit"
                  [disabled]="isSavingComment()"
                >
                  {{ isSavingComment() ? 'Guardando...' : 'Publicar comentario' }}
                </button>
              </form>
            } @else {
              <p class="mt-4 text-sm text-slate-600">
                Debes iniciar sesion para comentar.
                <a class="font-medium text-slate-900 underline" routerLink="/login">Ir a login</a>
              </p>
            }
          </section>

          <app-comments-list [comments]="comments()" />
        }
      </section>
    </main>
  `,
})
export class PostDetailPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  protected readonly authService = inject(AuthService);

  protected readonly post = signal<Post | null>(null);
  protected readonly comments = signal<PostComment[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly commentError = signal('');
  protected readonly isSavingComment = signal(false);

  protected readonly commentForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    body: ['', [Validators.required]],
  });

  constructor() {
    this.route.paramMap
      .pipe(
        // extrae el id de los parametros de ruta
        map((params) => params.get('id')),
        // cancela la peticion anterior si el id cambia
        switchMap((id) => {
          if (!id) {
            this.errorMessage.set('No se encontro el id del post.');
            return EMPTY;
          }

          return forkJoin({
            post: this.postsService.getPost(id),
            comments: this.postsService.getCommentsByPostId(id),
          }).pipe(
            // reintenta hasta 2 veces si alguna de las dos peticiones falla
            retry(2),
          );
        }),
        // actualiza los signals como efecto secundario al recibir los datos
        tap(({ post, comments }) => {
          this.post.set(post);
          this.comments.set(comments);
          this.isLoading.set(false);
        }),
        // captura el error definitivo tras los reintentos
        catchError(() => {
          this.errorMessage.set('No se pudo cargar el detalle del post.');
          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  protected isCommentInvalid(controlName: 'name' | 'email' | 'body'): boolean {
    const control = this.commentForm.controls[controlName];

    return control.invalid && (control.dirty || control.touched);
  }

  protected createComment(postId: string): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.isSavingComment.set(true);
    this.commentError.set('');

    this.postsService.createComment({ postId, ...this.commentForm.getRawValue() }).subscribe({
      next: (comment) => {
        this.comments.update((comments) => [comment, ...comments]);
        this.commentForm.reset();
        this.isSavingComment.set(false);
      },
      error: () => {
        this.commentError.set('No se pudo crear el comentario.');
        this.isSavingComment.set(false);
      },
    });
  }
}
