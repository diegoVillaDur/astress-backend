import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateDiaryDto {
  @IsString()
  @MinLength(1, { message: 'El contenido no puede estar vacío.' })
  @MaxLength(5000, { message: 'El contenido no puede exceder 5000 caracteres.' })
  content!: string;

  @IsString()
  userId!: string;
}

export class UpdateDiaryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  @IsOptional()
  content?: string;
}
