import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PostsModule, CommentsModule],
  controllers: [AppController],
})
export class AppModule {}
