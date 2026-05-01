// controlador para manejar las peticiones de los posts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post as HttpPost,
  Put,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ApiResponse } from '../common/utils/api-response';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // metodo para obtener todos los posts
  @Get()
  async findAll() {
    const posts = await this.postsService.findAll();

    return ApiResponse.success(posts, 'Posts obtenidos correctamente');
  }

  // metodo para obtener un post por su id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.validateObjectId(id);

    const post = await this.postsService.findOne(id);

    return ApiResponse.success(post, 'Post obtenido correctamente');
  }

  // metodo para crear un post
  @HttpPost()
  async create(@Body() createPostDto: CreatePostDto) {
    const post = await this.postsService.create(createPostDto);

    return ApiResponse.success(post, 'Post creado correctamente');
  }

  // metodo para crear muchos posts
  @HttpPost('bulk')
  async createMany(
    @Body(new ParseArrayPipe({ items: CreatePostDto }))
    createPostDtos: CreatePostDto[],
  ) {
    if (createPostDtos.length === 0) {
      throw new BadRequestException('El cuerpo debe ser un arreglo de posts');
    }

    const posts = await this.postsService.createMany(createPostDtos);

    return ApiResponse.success(posts, 'Posts creados correctamente');
  }

  // metodo para actualizar un post
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    this.validateObjectId(id);

    if (!updatePostDto || Object.keys(updatePostDto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para editar');
    }

    const post = await this.postsService.update(id, updatePostDto);

    return ApiResponse.success(post, 'Post actualizado correctamente');
  }

  // metodo para eliminar un post
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.validateObjectId(id);

    const post = await this.postsService.remove(id);

    return ApiResponse.success(post, 'Post eliminado correctamente');
  }

  // metodo para validar el id de un post
  private validateObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id invalido');
    }
  }
}
