import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiaryDto, UpdateDiaryDto } from './dto/create-diary.dto';

@Injectable()
export class DiaryService {
  constructor(private readonly prisma: PrismaService) { }

  // ── Crear entrada ────────────────────────────────────────────────
  async create(dto: CreateDiaryDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    const entry = await this.prisma.diaryEntry.create({
      data: {
        content: dto.content,
        userId: dto.userId,
      },
    });

    return { message: 'Entrada guardada en tu Bitácora de Calma.', entry };
  }

  // ── Obtener entradas de un usuario ──────────────────────────────
  async findByUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    const entries = await this.prisma.diaryEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { userId, totalEntries: entries.length, entries };
  }

  // ── Obtener una entrada por ID ───────────────────────────────────
  async findOne(id: string) {
    const entry = await this.prisma.diaryEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Entrada de diario no encontrada.');
    return entry;
  }

  // ── Actualizar entrada ───────────────────────────────────────────
  async update(id: string, dto: UpdateDiaryDto) {
    const entry = await this.prisma.diaryEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Entrada de diario no encontrada.');

    const updated = await this.prisma.diaryEntry.update({
      where: { id },
      data: { content: dto.content },
    });

    return { message: 'Entrada actualizada.', entry: updated };
  }

  // ── Eliminar entrada ─────────────────────────────────────────────
  async remove(id: string) {
    const entry = await this.prisma.diaryEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Entrada de diario no encontrada.');

    await this.prisma.diaryEntry.delete({ where: { id } });
    return { message: 'Entrada eliminada de tu bitácora.' };
  }
}
