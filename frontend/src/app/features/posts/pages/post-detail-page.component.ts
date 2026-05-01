// pagina para mostrar el detalle de un post
import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
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

        @if (post(); as post) {
          <article class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <header class="space-y-3">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div class="space-y-3">
                  <p class="text-sm font-medium uppercase tracking-wide text-slate-500">
                    {{ post.author }}
                  </p>
                  <h1 class="text-3xl font-bold text-slate-950">{{ post.title }}</h1>
                </div>
                <a
                  class="w-fit rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  [routerLink]="['/posts', post._id, 'edit']"
                >
                  Editar
                </a>
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
          </section>

          <app-comments-list [comments]="comments()" />
        } @else if (errorMessage()) {
          <p class="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            {{ errorMessage() }}
          </p>
        } @else {
          <p class="rounded-lg border border-slate-200 bg-white p-6 text-slate-500">
            Cargando detalle del post...
          </p>
        }
      </section>
    </main>
  `,
})
export class PostDetailPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  private readonly postId = this.route.snapshot.paramMap.get('id');

  protected readonly post = signal<Post | null>(null);
  protected readonly comments = signal<PostComment[]>([]);
  protected readonly errorMessage = signal('');
  protected readonly commentError = signal('');
  protected readonly isSavingComment = signal(false);

  protected readonly commentForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    body: ['', [Validators.required]],
  });

  constructor() {
    if (!this.postId) {
      this.errorMessage.set('No se encontro el id del post.');
      return;
    }

    forkJoin({
      post: this.postsService.getPost(this.postId),
      comments: this.postsService.getCommentsByPostId(this.postId),
    }).subscribe({
      next: ({ post, comments }) => {
        this.post.set(post);
        this.comments.set(comments);
      },
      error: () => this.errorMessage.set('No se pudo cargar el detalle del post.'),
    });
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
