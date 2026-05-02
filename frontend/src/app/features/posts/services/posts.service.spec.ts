// prueba para el servicio de posts
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let postsService: PostsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    postsService = TestBed.inject(PostsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('envia page, limit y search al consultar posts paginados', () => {
    postsService
      .getPosts({ page: 2, limit: 6, search: 'Angular' })
      .subscribe((response) => {
        expect(response).toEqual({
          items: [],
          total: 0,
          page: 2,
          limit: 6,
          totalPages: 0,
        });
      });

    const request = httpTestingController.expectOne(
      (req) =>
        req.url === '/api/posts' &&
        req.params.get('page') === '2' &&
        req.params.get('limit') === '6' &&
        req.params.get('search') === 'Angular',
    );

    expect(request.request.method).toBe('GET');
    request.flush({
      items: [],
      total: 0,
      page: 2,
      limit: 6,
      totalPages: 0,
    });
  });
});
