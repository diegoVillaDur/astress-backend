import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Devuelve la frase del día.
   * La lógica usa el día del año para rotar entre todas las frases disponibles,
   * así todos los usuarios del mismo día ven la misma frase (como una app real).
   */
  async getDailyQuote() {
    const quotes = await this.prisma.quote.findMany({
      where: { isActive: true },
      select: { id: true, text: true, author: true },
    });

    if (quotes.length === 0) {
      return {
        text: 'Hoy también eres capaz. 💪',
        author: null,
      };
    }

    // Usar el día del año como índice rotativo
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const index = dayOfYear % quotes.length;

    return quotes[index];
  }

  /**
   * Devuelve todas las frases (útil para admin o seed visual)
   */
  async getAllQuotes() {
    return this.prisma.quote.findMany({
      where: { isActive: true },
      select: { id: true, text: true, author: true },
    });
  }
}
