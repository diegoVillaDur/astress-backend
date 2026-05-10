import { Injectable, NotFoundException } from '@nestjs/common';
import { IsString, MaxLength, IsOptional } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

export class CreatePhraseDto {
  @IsString()
  @MaxLength(500)
  text!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  author?: string;
}

@Injectable()
export class PhrasesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Frase del día (aleatoria) ────────────────────────────────────
  async getDailyPhrase() {
    const count = await this.prisma.dailyPhrase.count();

    if (count === 0) {
      return {
        phrase: {
          text: 'Recuerda: un día a la vez. Tú puedes con esto.',
          author: 'AStress',
        },
      };
    }

    // Selección aleatoria basada en el día actual para que sea consistente por día
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
    );
    const skip = dayOfYear % count;

    const phrase = await this.prisma.dailyPhrase.findFirst({
      skip,
      orderBy: { createdAt: 'asc' },
    });

    return { phrase };
  }

  // ── Frase aleatoria (para refrescar) ────────────────────────────
  async getRandomPhrase() {
    const count = await this.prisma.dailyPhrase.count();

    if (count === 0) {
      return {
        phrase: {
          text: 'Cada día es una nueva oportunidad para comenzar.',
          author: 'AStress',
        },
      };
    }

    const skip = Math.floor(Math.random() * count);
    const phrase = await this.prisma.dailyPhrase.findFirst({
      skip,
      orderBy: { createdAt: 'asc' },
    });

    return { phrase };
  }

  // ── Todas las frases ─────────────────────────────────────────────
  async findAll() {
    const phrases = await this.prisma.dailyPhrase.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { total: phrases.length, phrases };
  }

  // ── Crear frase ──────────────────────────────────────────────────
  async create(dto: CreatePhraseDto) {
    const phrase = await this.prisma.dailyPhrase.create({ data: dto });
    return { message: 'Frase creada.', phrase };
  }

  // ── Eliminar frase ───────────────────────────────────────────────
  async remove(id: string) {
    const phrase = await this.prisma.dailyPhrase.findUnique({ where: { id } });
    if (!phrase) throw new NotFoundException('Frase no encontrada.');

    await this.prisma.dailyPhrase.delete({ where: { id } });
    return { message: 'Frase eliminada.' };
  }
}
