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
import { ApiResponse } from '../common/utils/api-response';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // metodo para obtener los comentarios de un post
  @Get()
  async findByPostId(@Query('postId') postId: string) {
    this.validateObjectId(postId, 'postId');

    const comments = await this.commentsService.findByPostId(postId);

    return ApiResponse.success(comments, 'Comentarios obtenidos correctamente');
  }

  // metodo para crear un comentario
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    const comment = await this.commentsService.create(createCommentDto);

    return ApiResponse.success(comment, 'Comentario creado correctamente');
  }

  // metodo para eliminar un comentario
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.validateObjectId(id, 'id');

    const comment = await this.commentsService.remove(id);

    return ApiResponse.success(comment, 'Comentario eliminado correctamente');
  }

  // metodo para validar el id de un comentario
  private validateObjectId(id: string, fieldName: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`${fieldName} invalido`);
    }
  }
}
