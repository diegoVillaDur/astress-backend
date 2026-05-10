import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/users/:id
   * Perfil público del usuario
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * GET /api/users/:id/mood-history
   * Historial de ánimo de los últimos 7 días (para la línea de tiempo)
   */
  @Get(':id/mood-history')
  getMoodHistory(@Param('id') id: string) {
    return this.usersService.getMoodHistory(id);
  }
}
