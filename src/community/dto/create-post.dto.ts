import { IsString, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string;
}

export class CreatePostDto {
  @IsString()
  @MinLength(1, { message: 'El contenido no puede estar vacío.' })
  @MaxLength(1000, { message: 'El contenido no puede exceder 1000 caracteres.' })
  content!: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;

  @IsString()
  userId!: string;

  @IsString()
  roomId!: string;
}

export class HeartPostDto {
  @IsString()
  userId!: string;
}
