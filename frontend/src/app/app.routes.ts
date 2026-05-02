// rutas de la aplicacion
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'posts',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page.component').then(
        (component) => component.LoginPageComponent,
      ),
  },
  {
    path: 'posts',
    // carga el componente de la pagina de listado de posts
    loadComponent: () =>
      import('./features/posts/pages/posts-list-page.component').then(
        (component) => component.PostsListPageComponent,
      ),
  },
  {
    path: 'posts/new',
    canActivate: [authGuard],
    // carga el componente de la pagina de creacion de post
    loadComponent: () =>
      import('./features/posts/pages/post-form-page.component').then(
        (component) => component.PostFormPageComponent,
      ),
  },
  {
    path: 'posts/:id/edit',
    canActivate: [authGuard],
    // carga el componente de la pagina de edicion de post
    loadComponent: () =>
      import('./features/posts/pages/post-form-page.component').then(
        (component) => component.PostFormPageComponent,
      ),
  },
  {
    path: 'posts/:id',
    // carga el componente de la pagina de detalle de post
    loadComponent: () =>
      import('./features/posts/pages/post-detail-page.component').then(
        (component) => component.PostDetailPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'posts',
  },
];
