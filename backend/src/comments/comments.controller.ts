// controlador para manejar las peticiones de los comentarios
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // metodo para obtener los comentarios de un post
  @Get()
  findByPostId(@Query('postId') postId: string) {
    this.validateObjectId(postId, 'postId');

    return this.commentsService.findByPostId(postId);
  }

  // metodo para crear un comentario
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    this.validateCreateCommentDto(createCommentDto);

    return this.commentsService.create(createCommentDto);
  }

  // metodo para eliminar un comentario
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.validateObjectId(id, 'id');

    return this.commentsService.remove(id);
  }

  // metodo para validar el DTO de creacion de comentario
  private validateCreateCommentDto(createCommentDto: CreateCommentDto) {
    if (
      !createCommentDto ||
      !this.isNonEmptyString(createCommentDto.postId) ||
      !this.isNonEmptyString(createCommentDto.name) ||
      !this.isNonEmptyString(createCommentDto.email) ||
      !this.isNonEmptyString(createCommentDto.body)
    ) {
      throw new BadRequestException(
        'postId, name, email y body son obligatorios',
      );
    }

    this.validateObjectId(createCommentDto.postId, 'postId');
  }
  
  // metodo para validar el id de un comentario
  private validateObjectId(id: string, fieldName: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`${fieldName} invalido`);
    }
  }
  
  // metodo para validar si el valor es un string no vacio
  private isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }
}
