import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMoodDto } from './dto/create-mood.dto';

@Injectable()
export class MoodService {
    constructor(private prisma: PrismaService) { }

    // ── CREAR ENTRADA DE ÁNIMO ───────────────────────────────
    async create(userId: string, dto: CreateMoodDto) {
        const entry = await this.prisma.moodEntry.create({
            data: {
                userId,
                level: dto.level,
                tags: JSON.stringify(dto.tags ?? []),  // ← guardar como string
                note: dto.note ?? null,
            },
        });

        return {
            message: 'Entrada de ánimo registrada ✅',
            entry,
            recommendation: this.getRecommendation(dto.level),
        };
    }

    // ── HISTORIAL DE LA SEMANA (para la línea de tiempo) ────
    async getWeekHistory(userId: string) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const entries = await this.prisma.moodEntry.findMany({
            where: {
                userId,
                createdAt: { gte: sevenDaysAgo },
            },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                level: true,
                tags: true,
                note: true,
                createdAt: true,
            },
        });

        // Mapear nivel a número para el gráfico del frontend
        const moodToNumber = {
            BURNOUT: 1,
            BAJO: 2,
            REGULAR: 3,
            BIEN: 4,
            ATOPE: 5,
        };

        const timeline = entries.map((e) => ({
            ...e,
            numericLevel: moodToNumber[e.level],
        }));

        return {
            entries: timeline,
            summary: this.buildWeeklySummary(entries),
        };
    }

    // ── ÚLTIMA ENTRADA DE HOY ─────────────────────────────────
    async getTodayEntry(userId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const entry = await this.prisma.moodEntry.findFirst({
            where: {
                userId,
                createdAt: { gte: today },
            },
            orderBy: { createdAt: 'desc' },
        });

        return entry;
    }

    // ── RECOMENDACIÓN SEGÚN NIVEL ─────────────────────────────
    private getRecommendation(level: string) {
        const recommendations = {
            ATOPE: {
                type: 'celebrate',
                title: '¡Qué buena energía! 🚀',
                message: 'Aprovecha este momento. ¿Hay algo pendiente que quieras avanzar?',
                action: null,
            },
            BIEN: {
                type: 'maintain',
                title: 'Vas bien 🙂',
                message: 'Mantén el ritmo. Recuerda tomar pausas cortas cada 45 minutos.',
                action: null,
            },
            REGULAR: {
                type: 'breathe',
                title: 'Ejercicio de respiración 🌬️',
                message: '1 minuto de respiración 4-7-8 puede ayudarte a centrarte.',
                action: { type: 'breathing', durationSeconds: 60 },
            },
            BAJO: {
                type: 'rest',
                title: 'Tiempo de recargar 🎵',
                message: 'Una siesta de 20 minutos o música ambiental puede hacer maravillas.',
                action: { type: 'music', genre: 'ambient' },
            },
            BURNOUT: {
                type: 'five_minutes',
                title: 'Técnica de los 5 minutos ⏱️',
                message:
                    'Elige UNA sola tarea y hazla por solo 5 minutos. Solo 5. Lo demás puede esperar.',
                action: { type: 'timer', durationSeconds: 300 },
            },
        };

        return recommendations[level] ?? null;
    }

    // ── RESUMEN SEMANAL ───────────────────────────────────────
    private buildWeeklySummary(entries: any[]) {
        if (entries.length === 0) {
            return { message: 'Aún no hay entradas esta semana', averageLevel: null };
        }

        const moodToNumber = { BURNOUT: 1, BAJO: 2, REGULAR: 3, BIEN: 4, ATOPE: 5 };
        const avg =
            entries.reduce((sum, e) => sum + moodToNumber[e.level], 0) / entries.length;

        const avgRounded = Math.round(avg);
        const levelNames = { 1: 'BURNOUT', 2: 'BAJO', 3: 'REGULAR', 4: 'BIEN', 5: 'ATOPE' };

        return {
            totalEntries: entries.length,
            averageNumeric: parseFloat(avg.toFixed(1)),
            averageLevel: levelNames[avgRounded],
            message:
                avg <= 2
                    ? 'Ha sido una semana difícil. Recuerda que puedes pedir apoyo. 💙'
                    : avg <= 3
                        ? 'Semana con altibajos, ¡pero la estás llevando!'
                        : '¡Buena semana! Sigue cuidándote así. 🌟',
        };
    }
}
