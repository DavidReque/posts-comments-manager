// controlador para manejar las peticiones de los posts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post as HttpPost,
  Put,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // metodo para obtener todos los posts
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // metodo para obtener un post por su id
  @Get(':id')
  findOne(@Param('id') id: string) {
    this.validateObjectId(id);

    return this.postsService.findOne(id);
  }

  // metodo para crear un post
  @HttpPost()
  create(@Body() createPostDto: CreatePostDto) {
    this.validateCreatePostDto(createPostDto);

    return this.postsService.create(createPostDto);
  }

  // metodo para crear muchos posts
  @HttpPost('bulk')
  createMany(@Body() createPostDtos: CreatePostDto[]) {
    if (!Array.isArray(createPostDtos) || createPostDtos.length === 0) {
      throw new BadRequestException('El cuerpo debe ser un arreglo de posts');
    }

    createPostDtos.forEach((postDto) => this.validateCreatePostDto(postDto));

    return this.postsService.createMany(createPostDtos);
  }

  // metodo para actualizar un post
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    this.validateObjectId(id);
    this.validateUpdatePostDto(updatePostDto);

    return this.postsService.update(id, updatePostDto);
  }

  // metodo para eliminar un post
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.validateObjectId(id);

    return this.postsService.remove(id);
  }

  // metodo para validar el DTO de creacion de post
  private validateCreatePostDto(createPostDto: CreatePostDto) {
    if (
      !createPostDto ||
      !this.isNonEmptyString(createPostDto.title) ||
      !this.isNonEmptyString(createPostDto.body) ||
      !this.isNonEmptyString(createPostDto.author)
    ) {
      throw new BadRequestException('title, body y author son obligatorios');
    }
  }

  // metodo para validar el DTO de actualizacion de post
  private validateUpdatePostDto(updatePostDto: UpdatePostDto) {
    if (!updatePostDto || Object.keys(updatePostDto).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para editar');
    }

    const { title, body, author } = updatePostDto;

    if (
      (title !== undefined && !this.isNonEmptyString(title)) ||
      (body !== undefined && !this.isNonEmptyString(body)) ||
      (author !== undefined && !this.isNonEmptyString(author))
    ) {
      throw new BadRequestException('Los campos enviados deben ser texto');
    }
  }

  // metodo para validar el id de un post
  private validateObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id invalido');
    }
  }

  // metodo para validar si el valor es un string no vacio
  private isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }
}
