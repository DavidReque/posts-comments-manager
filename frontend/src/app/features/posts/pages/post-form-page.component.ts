// pagina para crear o editar un post
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-post-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="min-h-screen bg-slate-50 px-4 py-8">
      <section class="mx-auto max-w-3xl space-y-6">
        <a class="text-sm font-medium text-slate-600 hover:text-slate-950" routerLink="/posts">
          Volver al listado
        </a>

        <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <header>
            <p class="text-sm font-medium uppercase tracking-wide text-slate-500">
              {{ isEditMode() ? 'Editar' : 'Crear' }}
            </p>
            <h1 class="mt-2 text-3xl font-bold text-slate-950">
              {{ isEditMode() ? 'Editar post' : 'Crear post' }}
            </h1>
          </header>

          <form class="mt-6 space-y-5" [formGroup]="postForm" (ngSubmit)="save()">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700" for="title">Titulo</label>
              <input
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
                id="title"
                type="text"
                formControlName="title"
              />
              @if (isInvalid('title')) {
                <p class="text-sm text-red-600">El titulo es requerido y debe tener minimo 3 caracteres.</p>
              }
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700" for="author">Autor</label>
              <input
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
                id="author"
                type="text"
                formControlName="author"
              />
              @if (isInvalid('author')) {
                <p class="text-sm text-red-600">El autor es requerido.</p>
              }
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700" for="body">Contenido</label>
              <textarea
                class="min-h-40 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
                id="body"
                formControlName="body"
              ></textarea>
              @if (isInvalid('body')) {
                <p class="text-sm text-red-600">El contenido es requerido y debe tener minimo 10 caracteres.</p>
              }
            </div>

            @if (errorMessage()) {
              <p class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ errorMessage() }}</p>
            }

            <div class="flex flex-wrap gap-2">
              <button
                class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                type="submit"
                [disabled]="isSaving()"
              >
                {{ isSaving() ? 'Guardando...' : 'Guardar' }}
              </button>
              <a
                class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                routerLink="/posts"
              >
                Cancelar
              </a>
            </div>
          </form>
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
          this.postForm.patchValue({
            title: post.title,
            body: post.body,
            author: post.author,
          });
        },
        error: () => this.errorMessage.set('No se pudo cargar el post.'),
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
