// servicio para manejar las operaciones de los posts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './schemas/post.schema';

@Injectable()
export class PostsService {
  // inyeccion de dependencias del modelo de Post
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {}
  
  // metodo para obtener todos los posts
  findAll() {
    return this.postModel.find().exec();
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
}
