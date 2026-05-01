// componente para mostrar un post en un card
import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../services/posts.service';

@Component({
  selector: 'app-post-card',
  imports: [DatePipe, RouterLink],
  template: `
    <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div class="space-y-2">
        <h2 class="text-xl font-semibold text-slate-900">{{ post().title }}</h2>
        <p class="text-sm text-slate-600">
          Autor: <span class="font-medium">{{ post().author }}</span>
        </p>
        <time class="block text-sm text-slate-500" [dateTime]="post().createdAt">
          {{ post().createdAt | date: 'mediumDate' }}
        </time>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <a
          class="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          [routerLink]="['/posts', post()._id]"
        >
          Ver
        </a>
        <a
          class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          [routerLink]="['/posts', post()._id, 'edit']"
        >
          Editar
        </a>
        <button
          class="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-300"
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
