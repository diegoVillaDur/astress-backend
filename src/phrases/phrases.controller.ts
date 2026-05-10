import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PhrasesService, CreatePhraseDto } from './phrases.service';

@Controller('phrases')
export class PhrasesController {
  constructor(private readonly phrasesService: PhrasesService) {}

  /**
   * GET /api/phrases/today
   * Frase del día (consistente durante el mismo día)
   */
  @Get('today')
  getDailyPhrase() {
    return this.phrasesService.getDailyPhrase();
  }

  /**
   * GET /api/phrases/random
   * Frase aleatoria (para cuando el usuario quiere refrescar)
   */
  @Get('random')
  getRandomPhrase() {
    return this.phrasesService.getRandomPhrase();
  }

  /**
   * GET /api/phrases
   * Todas las frases disponibles
   */
  @Get()
  findAll() {
    return this.phrasesService.findAll();
  }

  /**
   * POST /api/phrases
   * Agregar una nueva frase al banco
   */
  @Post()
  create(@Body() dto: CreatePhraseDto) {
    return this.phrasesService.create(dto);
  }

  /**
   * DELETE /api/phrases/:id
   * Eliminar una frase
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phrasesService.remove(id);
  }
}
