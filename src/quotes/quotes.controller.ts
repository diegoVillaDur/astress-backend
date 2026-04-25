import { Controller, Get, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  /**
   * GET /quotes/daily
   * Devuelve la frase motivadora del día (requiere auth)
   */
  @Get('daily')
  async getDailyQuote() {
    return this.quotesService.getDailyQuote();
  }
}
