import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { MoodLevel } from '@prisma/client';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  /**
   * GET /api/recommendations/levels
   * Lista todos los niveles de ánimo disponibles
   */
  @Get('levels')
  getAllLevels() {
    return this.recommendationsService.getAllLevels();
  }

  /**
   * GET /api/recommendations/:moodLevel
   * Recomendaciones según el nivel de ánimo indicado
   * Ejemplo: /api/recommendations/BURNOUT_TOTAL
   */
  @Get(':moodLevel')
  getByMoodLevel(@Param('moodLevel') moodLevel: string) {
    const validLevels = Object.values(MoodLevel);

    if (!validLevels.includes(moodLevel as MoodLevel)) {
      throw new BadRequestException(
        `Nivel de ánimo inválido. Valores aceptados: ${validLevels.join(', ')}`,
      );
    }

    return this.recommendationsService.getByMoodLevel(moodLevel as MoodLevel);
  }
}
