// servicio para manejar las operaciones de los posts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

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

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);

  // metodo para obtener todos los posts
  getPosts(): Observable<Post[]> {
    return this.http
      .get<ApiResponse<Post[]>>('/api/posts')
      .pipe(map((response) => response.data));
  }

  // metodo para obtener un post por su id
  getPost(id: string): Observable<Post> {
    return this.http
      .get<ApiResponse<Post>>(`/api/posts/${id}`)
      .pipe(map((response) => response.data));
  }

  // metodo para crear un post
  createPost(payload: PostPayload): Observable<Post> {
    return this.http
      .post<ApiResponse<Post>>('/api/posts', payload)
      .pipe(map((response) => response.data));
  }

  updatePost(id: string, payload: PostPayload): Observable<Post> {
    return this.http
      .put<ApiResponse<Post>>(`/api/posts/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  // metodo para obtener los comentarios de un post por su id
  getCommentsByPostId(postId: string): Observable<PostComment[]> {
    return this.http
      .get<ApiResponse<PostComment[]>>('/api/comments', { params: { postId } })
      .pipe(map((response) => response.data));
  }

  // metodo para crear un comentario
  createComment(payload: CommentPayload): Observable<PostComment> {
    return this.http
      .post<ApiResponse<PostComment>>('/api/comments', payload)
      .pipe(map((response) => response.data));
  }
}
