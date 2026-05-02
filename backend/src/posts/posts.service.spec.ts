// prueba para el servicio de posts
import { PostsService } from './posts.service';
// prueba para verificar que se obtiene posts paginados con metadata
describe('PostsService', () => {
  it('obtiene posts paginados con metadata', async () => {
    const posts = [{ title: 'Post 1' }, { title: 'Post 2' }];
    const queryMock = createQueryMock(posts);
    const countMock = { exec: jest.fn().mockResolvedValue(8) };
    const postModel = {
      find: jest.fn().mockReturnValue(queryMock),
      countDocuments: jest.fn().mockReturnValue(countMock),
    };
    const service = new PostsService(postModel as never);

    const result = await service.findAll({ page: 2, limit: 2, search: '' });

    expect(postModel.find).toHaveBeenCalledWith({});
    expect(queryMock.skip).toHaveBeenCalledWith(2);
    expect(queryMock.limit).toHaveBeenCalledWith(2);
    expect(postModel.countDocuments).toHaveBeenCalledWith({});
    expect(result).toEqual({
      items: posts,
      total: 8,
      page: 2,
      limit: 2,
      totalPages: 4,
    });
  });

  it('filtra por titulo cuando recibe search', async () => { // prueba para verificar que se filtra por titulo cuando recibe search
    // verifica que se filtra por titulo cuando recibe search
    const queryMock = createQueryMock([]);
    const countMock = { exec: jest.fn().mockResolvedValue(0) };
    const postModel = {
      find: jest.fn().mockReturnValue(queryMock),
      countDocuments: jest.fn().mockReturnValue(countMock),
    };
    const service = new PostsService(postModel as never);

    await service.findAll({ page: 1, limit: 6, search: 'Angular?' });

    expect(postModel.find).toHaveBeenCalledWith({
      title: { $regex: 'Angular\\?', $options: 'i' },
    });
  });
});

function createQueryMock(posts: unknown[]) {
  const queryMock = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(posts),
  };

  return queryMock;
}
