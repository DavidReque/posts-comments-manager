// servicio para manejar las operaciones de los comentarios
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  // inyeccion de dependencias del modelo de Comment
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  // metodo para obtener los comentarios de un post
  findByPostId(postId: string) {
    return this.commentModel.find({ postId }).exec();
  }

  // metodo para crear un comentario
  create(createCommentDto: CreateCommentDto) {
    return this.commentModel.create(createCommentDto);
  }

  // metodo para eliminar un comentario
  async remove(id: string) {
    const comment = await this.commentModel.findByIdAndDelete(id).exec();

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    return comment;
  }
}
