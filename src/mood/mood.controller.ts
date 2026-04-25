import { Controller, Post, Get, Body } from '@nestjs/common';
import { MoodService } from './mood.service';
import { CreateMoodDto } from './dto/create-mood.dto';

@Controller('mood')
export class MoodController {
  constructor(private moodService: MoodService) {}

  @Post()
  async create(@Body() dto: CreateMoodDto) {
    return this.moodService.create(dto.userId, dto);
  }

  @Get('week')
  async getWeekHistory(@Body() body: { userId: string }) {
    return this.moodService.getWeekHistory(body.userId);
  }

  @Get('today')
  async getTodayEntry(@Body() body: { userId: string }) {
    return this.moodService.getTodayEntry(body.userId);
  }
}
