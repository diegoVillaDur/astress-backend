import {
  IsEnum,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { MoodLevel, MoodTag } from '@prisma/client';

export class CreateMoodDto {
  @IsEnum(MoodLevel, {
    message: `El nivel debe ser uno de: ${Object.values(MoodLevel).join(', ')}`,
  })
  level!: MoodLevel;

  @IsArray()
  @IsEnum(MoodTag, {
    each: true,
    message: `Cada etiqueta debe ser una de: ${Object.values(MoodTag).join(', ')}`,
  })
  @IsOptional()
  tags?: MoodTag[];

  @IsString()
  @MaxLength(500, { message: 'La nota no puede exceder 500 caracteres.' })
  @IsOptional()
  note?: string;

  @IsString()
  userId!: string;
}
