import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { MoodService } from './mood.service';
import { CreateMoodDto } from './dto/create-mood.dto';

@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  /**
   * POST /api/mood
   * Registrar un nuevo estado de ánimo (Radar de Ánimo)
   */
  @Post()
  create(@Body() dto: CreateMoodDto) {
    return this.moodService.create(dto);
  }

  /**
   * GET /api/mood/user/:userId
   * Todas las entradas de ánimo de un usuario
   */
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.moodService.findByUser(userId);
  }

  /**
   * GET /api/mood/user/:userId/latest
   * Última entrada de ánimo del usuario
   */
  @Get('user/:userId/latest')
  findLatest(@Param('userId') userId: string) {
    return this.moodService.findLatest(userId);
  }

  /**
   * DELETE /api/mood/:id
   * Eliminar una entrada de ánimo
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moodService.remove(id);
  }
}
