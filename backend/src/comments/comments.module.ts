import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';
import { CommentsController } from './comments.controller';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, AuthGuard],
})
export class CommentsModule {}
