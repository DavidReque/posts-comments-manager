// componente para listar los comentarios de un post
import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PostComment } from '../services/posts.service';

@Component({
  selector: 'app-comments-list',
  imports: [DatePipe],
  template: `
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">Comentarios</h2>

      @if (comments().length > 0) {
        <div class="space-y-3">
          @for (comment of comments(); track comment._id) {
            <article class="rounded-lg border border-slate-200 bg-white p-4">
              <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 class="font-semibold text-slate-900">{{ comment.name }}</h3>
                <time class="text-sm text-slate-500" [dateTime]="comment.createdAt">
                  {{ comment.createdAt | date: 'mediumDate' }}
                </time>
              </div>
              <p class="mt-1 text-sm text-slate-500">{{ comment.email }}</p>
              <p class="mt-3 text-slate-700">{{ comment.body }}</p>
            </article>
          }
        </div>
      } @else {
        <p class="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
          Este post no tiene comentarios.
        </p>
      }
    </section>
  `,
})
export class CommentsListComponent {
  readonly comments = input.required<PostComment[]>();
}
