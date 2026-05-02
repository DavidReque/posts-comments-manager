import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { PostsService } from './posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, AuthGuard],
})
export class PostsModule {}
