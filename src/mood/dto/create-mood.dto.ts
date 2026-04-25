import { IsIn, IsOptional, IsString, IsArray, MaxLength } from 'class-validator';

const MOOD_LEVELS = ['ATOPE', 'BIEN', 'REGULAR', 'BAJO', 'BURNOUT'];
const MOOD_TAGS = ['EXAMENES', 'FALTA_DE_SUENO', 'PROBLEMAS_PERSONALES', 'CARGA_DE_TAREAS'];

export class CreateMoodDto {
  @IsString()
  @IsIn(MOOD_LEVELS, { message: `El nivel debe ser: ${MOOD_LEVELS.join(', ')}` })
  level: string;

  @IsOptional()
  @IsArray()
  @IsIn(MOOD_TAGS, { each: true, message: `Tag inválido. Opciones: ${MOOD_TAGS.join(', ')}` })
  tags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
