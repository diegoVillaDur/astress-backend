import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsInt, Min, Max } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @IsOptional()
  @IsString()
  career?: string; // Carrera universitaria

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  semester?: number; // Semestre actual
}
