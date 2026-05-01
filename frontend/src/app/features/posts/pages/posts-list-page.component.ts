// pagina para mostrar el listado de posts
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostCardComponent } from '../components/post-card.component';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-posts-list-page',
  imports: [AsyncPipe, PostCardComponent, RouterLink],
  template: `
    <main class="min-h-screen bg-slate-50 px-4 py-8">
      <section class="mx-auto max-w-5xl space-y-6">
        <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-medium uppercase tracking-wide text-slate-500">Posts</p>
            <h1 class="mt-2 text-3xl font-bold text-slate-950">Listado de posts</h1>
          </div>
          <a
            class="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            routerLink="/posts/new"
          >
            Crear post
          </a>
        </header>

        @if (posts$ | async; as posts) {
          @if (posts.length > 0) {
            <div class="grid gap-4 md:grid-cols-2">
              @for (post of posts; track post._id) {
                <app-post-card [post]="post" />
              }
            </div>
          } @else {
            <p class="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-500">
              No hay posts disponibles.
            </p>
          }
        } @else {
          <p class="rounded-lg border border-slate-200 bg-white p-6 text-slate-500">
            Cargando posts...
          </p>
        }
      </section>
    </main>
  `,
})
export class PostsListPageComponent {
  private readonly postsService = inject(PostsService);

  protected readonly posts$ = this.postsService.getPosts();
}
