// pagina para crear o editar un post
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AutofocusDirective } from '../../../shared/directives/autofocus.directive';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-post-form-page',
  imports: [ReactiveFormsModule, RouterLink, AutofocusDirective],
  template: `
    <main class="min-h-screen bg-slate-50 px-4 py-8">
      <section class="mx-auto max-w-3xl space-y-6">
        <a class="text-sm font-medium text-slate-600 hover:text-slate-950" routerLink="/posts">
          Volver al listado
        </a>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <header class="border-b border-slate-100 pb-5">
            <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {{ isEditMode() ? 'Editar' : 'Nuevo' }}
            </p>
            <h1 class="mt-1 text-2xl font-bold text-slate-950">
              {{ isEditMode() ? 'Editar post' : 'Crear post' }}
            </h1>
          </header>

          @if (isLoadingPost()) {
            <div class="mt-6 animate-pulse space-y-5">
              @for (_ of [1, 2, 3]; track $index) {
                <div class="space-y-2">
                  <div class="h-4 w-20 rounded bg-slate-200"></div>
                  <div class="h-10 w-full rounded-md bg-slate-200"></div>
                </div>
              }
            </div>
          } @else {
            <form class="mt-6 space-y-5" [formGroup]="postForm" (ngSubmit)="save()">
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-700" for="title">Titulo</label>
                <input
                  class="w-full rounded-md border px-3 py-2 text-slate-900 outline-none transition-colors
                    {{ isInvalid('title') ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-slate-300 focus:border-slate-900' }}"
                  id="title"
                  type="text"
                  formControlName="title"
                  appAutofocus
                />
                @if (isInvalid('title')) {
                  <p class="flex items-center gap-1 text-xs text-red-600">
                    <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clip-rule="evenodd"/></svg>
                    Requerido, mínimo 3 caracteres.
                  </p>
                }
              </div>

              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-700" for="author">Autor</label>
                <input
                  class="w-full rounded-md border px-3 py-2 text-slate-900 outline-none transition-colors
                    {{ isInvalid('author') ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-slate-300 focus:border-slate-900' }}"
                  id="author"
                  type="text"
                  formControlName="author"
                />
                @if (isInvalid('author')) {
                  <p class="flex items-center gap-1 text-xs text-red-600">
                    <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clip-rule="evenodd"/></svg>
                    El autor es requerido.
                  </p>
                }
              </div>

              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-700" for="body">Contenido</label>
                <textarea
                  class="min-h-44 w-full rounded-md border px-3 py-2 text-slate-900 outline-none transition-colors
                    {{ isInvalid('body') ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-slate-300 focus:border-slate-900' }}"
                  id="body"
                  formControlName="body"
                ></textarea>
                @if (isInvalid('body')) {
                  <p class="flex items-center gap-1 text-xs text-red-600">
                    <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clip-rule="evenodd"/></svg>
                    Requerido, mínimo 10 caracteres.
                  </p>
                }
              </div>

              @if (errorMessage()) {
                <div class="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <svg class="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.75-9.25a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z" clip-rule="evenodd"/></svg>
                  <p class="text-sm text-red-700">{{ errorMessage() }}</p>
                </div>
              }

              <div class="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  class="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  type="submit"
                  [disabled]="isSaving()"
                >
                  @if (isSaving()) {
                    <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    Guardando...
                  } @else {
                    Guardar
                  }
                </button>
                <a
                  class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  routerLink="/posts"
                >
                  Cancelar
                </a>
              </div>
            </form>
          }
        </div>
      </section>
    </main>
  `,
})
export class PostFormPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly postsService = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postId = this.route.snapshot.paramMap.get('id');

  protected readonly isEditMode = signal(Boolean(this.postId));
  protected readonly isLoadingPost = signal(Boolean(this.postId));
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly postForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    body: ['', [Validators.required, Validators.minLength(10)]],
    author: ['', [Validators.required]],
  });

  constructor() {
    if (this.postId) {
      this.postsService.getPost(this.postId).subscribe({
        next: (post) => {
          this.postForm.patchValue({ title: post.title, body: post.body, author: post.author });
          this.isLoadingPost.set(false);
        },
        error: () => {
          this.errorMessage.set('No se pudo cargar el post.');
          this.isLoadingPost.set(false);
        },
      });
    }
  }

  protected isInvalid(controlName: 'title' | 'body' | 'author'): boolean {
    const control = this.postForm.controls[controlName];

    return control.invalid && (control.dirty || control.touched);
  }

  protected save(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    const payload = this.postForm.getRawValue();
    const request = this.postId
      ? this.postsService.updatePost(this.postId, payload)
      : this.postsService.createPost(payload);

    request.subscribe({
      next: (post) => void this.router.navigate(['/posts', post._id]),
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set('No se pudo guardar el post.');
      },
    });
  }
}
