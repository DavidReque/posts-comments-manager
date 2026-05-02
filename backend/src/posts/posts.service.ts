// servicio para manejar las operaciones de los posts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './schemas/post.schema';

type PostFilter = Record<string, unknown>;

export interface PaginatedPosts {
  items: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class PostsService {
  // inyeccion de dependencias del modelo de Post
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {}
  
  // metodo para obtener posts paginados
  async findAll(query: FindPostsQueryDto): Promise<PaginatedPosts> {
    const page = query.page; // pagina actual
    const limit = query.limit; // limite de posts por pagina
    const skip = (page - 1) * limit; // cantidad de posts a saltar
    const filter = this.buildFilter(query.search); // filtro de busqueda
    const [items, total] = await Promise.all([ // resultados de la busqueda
      // busca los posts con el filtro y los ordena por fecha de creacion
      this.postModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // metodo para obtener un post por su id
  async findOne(id: string) {
    const post = await this.postModel.findById(id).exec();

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    return post;
  }

  // metodo para crear un post
  create(createPostDto: CreatePostDto) {
    return this.postModel.create(createPostDto);
  }

  // metodo para crear muchos posts
  createMany(createPostDtos: CreatePostDto[]) {
    return this.postModel.insertMany(createPostDtos);
  }

  // metodo para actualizar un post
  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true, runValidators: true })
      .exec();

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    return post;
  }

  // metodo para eliminar un post
  async remove(id: string) {
    const post = await this.postModel.findByIdAndDelete(id).exec();

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    return post;
  }

  private buildFilter(search: string): PostFilter {
    const normalizedSearch = search.trim();

    if (!normalizedSearch) {
      return {};
    }

    return {
      title: { $regex: this.escapeRegex(normalizedSearch), $options: 'i' },
    };
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
