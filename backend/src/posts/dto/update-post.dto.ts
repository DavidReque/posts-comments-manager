import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  // validacion del titulo del post
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  // validacion del cuerpo del post
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  body?: string;

  // validacion del autor del post
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  author?: string;
}
