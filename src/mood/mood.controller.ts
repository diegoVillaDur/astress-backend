import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { MoodService } from './mood.service';
import { CreateMoodDto } from './dto/create-mood.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('mood')
export class MoodController {
  constructor(private moodService: MoodService) {}

  /**
   * POST /mood
   * Registra una entrada de ánimo (Radar de Ánimo)
   * Body: { level: "REGULAR", tags: ["EXAMENES"], note: "..." }
   */
  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateMoodDto) {
    return this.moodService.create(user.id, dto);
  }

  /**
   * GET /mood/week
   * Devuelve las entradas de los últimos 7 días (para la línea de tiempo)
   */
  @Get('week')
  async getWeekHistory(@CurrentUser() user: any) {
    return this.moodService.getWeekHistory(user.id);
  }

  /**
   * GET /mood/today
   * Devuelve la última entrada de hoy (para saber si ya registró su ánimo)
   */
  @Get('today')
  async getTodayEntry(@CurrentUser() user: any) {
    return this.moodService.getTodayEntry(user.id);
  }
}
