import { RenderMode, ServerRoute } from '@angular/ssr';

// rutas de la aplicacion para el servidor
export const serverRoutes: ServerRoute[] = [
  {
    path: 'posts',
    // carga el componente de la pagina de listado de posts
    renderMode: RenderMode.Client
  },
  {
    path: 'posts/new',
    // carga el componente de la pagina de creacion de post
    renderMode: RenderMode.Client
  },
  {
    path: 'posts/:id/edit',
    // carga el componente de la pagina de edicion de post
    renderMode: RenderMode.Client
  },
  {
    path: 'posts/:id',
    // carga el componente de la pagina de detalle de post
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
