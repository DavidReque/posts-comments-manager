import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsMongoId()
  // validacion del id del post
  postId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  // validacion del email del comentario
  email: string;

  @IsString()
  @IsNotEmpty()
  // validacion del cuerpo del comentario
  body: string;
}
