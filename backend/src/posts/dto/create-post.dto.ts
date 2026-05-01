// DTO  para crear un post en la base de datos
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  // validacion del titulo del post
  @IsString()
  @IsNotEmpty()
  title: string;

  // validacion del cuerpo del post
  @IsString()
  @IsNotEmpty()
  body: string;

  // validacion del autor del post
  @IsString()
  @IsNotEmpty()
  author: string;
}
