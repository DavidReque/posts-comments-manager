// componente para mostrar un post en un card
import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../services/posts.service';

@Component({
  selector: 'app-post-card',
  imports: [DatePipe, RouterLink],
  template: `
    <article class="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <div class="flex-1 space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {{ post().author }}
          </span>
          <time class="text-xs text-slate-400" [dateTime]="post().createdAt">
            {{ post().createdAt | date: 'mediumDate' }}
          </time>
        </div>
        <h2 class="text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-slate-700">
          {{ post().title }}
        </h2>
        <p class="line-clamp-2 text-sm text-slate-500">{{ post().body }}</p>
      </div>

      <div class="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <a
          class="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          [routerLink]="['/posts', post()._id]"
        >
          Ver
        </a>
        <a
          class="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          [routerLink]="['/posts', post()._id, 'edit']"
        >
          Editar
        </a>
        <button
          class="cursor-not-allowed rounded-md border border-red-100 px-3 py-1.5 text-sm font-medium text-red-300"
          type="button"
          disabled
        >
          Eliminar
        </button>
      </div>
    </article>
  `,
})
export class PostCardComponent {
  readonly post = input.required<Post>();
}
