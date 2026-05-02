// componente para listar los comentarios de un post
import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { PostComment } from '../services/posts.service';

@Component({
  selector: 'app-comments-list',
  imports: [DatePipe, TruncatePipe],
  template: `
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-slate-900">Comentarios</h2>
        @if (comments().length > 0) {
          <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {{ comments().length }}
          </span>
        }
      </div>

      @if (comments().length > 0) {
        <div class="space-y-3">
          @for (comment of comments(); track comment._id) {
            <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 class="font-semibold text-slate-900">{{ comment.name }}</h3>
                  <p class="text-xs text-slate-400">{{ comment.email }}</p>
                </div>
                <time class="shrink-0 text-xs text-slate-400" [dateTime]="comment.createdAt">
                  {{ comment.createdAt | date: 'mediumDate' }}
                </time>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-slate-700">{{ comment.body | truncate: 220 }}</p>
            </article>
          }
        </div>
      } @else {
        <div class="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center">
          <svg class="h-10 w-10 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
          </svg>
          <p class="mt-3 text-sm font-medium text-slate-600">Sin comentarios aún</p>
          <p class="mt-1 text-xs text-slate-400">Sé el primero en comentar este post.</p>
        </div>
      }
    </section>
  `,
})
export class CommentsListComponent {
  readonly comments = input.required<PostComment[]>();
}
