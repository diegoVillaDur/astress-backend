import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto, UpdateDiaryDto } from './dto/create-diary.dto';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) { }

  /**
   * POST /api/diary
   * Crear una nueva entrada en la Bitácora de Calma
   */
  @Post()
  create(@Body() dto: CreateDiaryDto) {
    return this.diaryService.create(dto);
  }

  /**
   * GET /api/diary/user/:userId
   * Todas las entradas de diario del usuario
   */
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.diaryService.findByUser(userId);
  }

  /**
   * GET /api/diary/:id
   * Obtener una entrada específica
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diaryService.findOne(id);
  }

  /**
   * PATCH /api/diary/:id
   * Actualizar una entrada de diario
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDiaryDto) {
    return this.diaryService.update(id, dto);
  }

  /**
   * DELETE /api/diary/:id
   * Eliminar una entrada de diario
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diaryService.remove(id);
  }
}
