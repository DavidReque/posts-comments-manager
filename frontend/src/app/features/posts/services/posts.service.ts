// servicio para manejar las operaciones de los posts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

// interface para el post
export interface Post {
  _id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// interface para el comentario de un post
export interface PostComment {
  _id: string;
  postId: string;
  name: string;
  email: string;
  body: string;
  createdAt: string;
}

// interface para el payload de creacion de post
export interface PostPayload {
  title: string;
  body: string;
  author: string;
}

// interface para el payload de creacion de comentario
export interface CommentPayload {
  postId: string;
  name: string;
  email: string;
  body: string;
}

// interface para la respuesta paginada de posts
export interface PaginatedPosts {
  items: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PostsQuery {
  page: number;
  limit: number;
  search?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);

  // metodo para obtener posts paginados
  getPosts(query: PostsQuery): Observable<PaginatedPosts> {
    return this.http.get<PaginatedPosts>('/api/posts', {
      params: {
        page: query.page,
        limit: query.limit,
        ...(query.search ? { search: query.search } : {}),
      },
    });
  }

  // metodo para obtener un post por su id
  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`/api/posts/${id}`);
  }

  // metodo para crear un post
  createPost(payload: PostPayload): Observable<Post> {
    return this.http.post<Post>('/api/posts', payload);
  }

  updatePost(id: string, payload: PostPayload): Observable<Post> {
    return this.http.put<Post>(`/api/posts/${id}`, payload);
  }

  // metodo para obtener los comentarios de un post por su id
  getCommentsByPostId(postId: string): Observable<PostComment[]> {
    return this.http.get<PostComment[]>('/api/comments', { params: { postId } });
  }

  // metodo para crear un comentario
  createComment(payload: CommentPayload): Observable<PostComment> {
    return this.http.post<PostComment>('/api/comments', payload);
  }
}
