import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMoodDto } from './dto/create-mood.dto';

@Injectable()
export class MoodService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Registrar entrada de ánimo ───────────────────────────────────
  async create(dto: CreateMoodDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    const entry = await this.prisma.moodEntry.create({
      data: {
        level: dto.level,
        tags: dto.tags ?? [],
        note: dto.note,
        userId: dto.userId,
      },
    });

    return {
      message: 'Estado de ánimo registrado.',
      entry,
    };
  }

  // ── Obtener entradas de un usuario ──────────────────────────────
  async findByUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    const entries = await this.prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return { userId, totalEntries: entries.length, entries };
  }

  // ── Obtener última entrada de ánimo ─────────────────────────────
  async findLatest(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    const entry = await this.prisma.moodEntry.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!entry) {
      return { message: 'Aún no has registrado ningún estado de ánimo.', entry: null };
    }

    return { entry };
  }

  // ── Eliminar entrada ────────────────────────────────────────────
  async remove(id: string) {
    const entry = await this.prisma.moodEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Entrada de ánimo no encontrada.');

    await this.prisma.moodEntry.delete({ where: { id } });
    return { message: 'Entrada eliminada.' };
  }
}
