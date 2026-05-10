import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateRoomDto, CreatePostDto, HeartPostDto } from './dto/create-post.dto';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) { }

  // ── Salas ────────────────────────────────────────────────────────

  /**
   * POST /api/community/rooms
   * Crear una nueva sala temática
   */
  @Post('rooms')
  createRoom(@Body() dto: CreateRoomDto) {
    return this.communityService.createRoom(dto);
  }

  /**
   * GET /api/community/rooms
   * Listar todas las salas disponibles
   */
  @Get('rooms')
  findAllRooms() {
    return this.communityService.findAllRooms();
  }

  /**
   * GET /api/community/rooms/:id
   * Obtener una sala por ID
   */
  @Get('rooms/:id')
  findOneRoom(@Param('id') id: string) {
    return this.communityService.findOneRoom(id);
  }

  // ── Publicaciones ────────────────────────────────────────────────

  /**
   * POST /api/community/posts
   * Publicar en el Muro de Apoyo (puede ser anónimo)
   */
  @Post('posts')
  createPost(@Body() dto: CreatePostDto) {
    return this.communityService.createPost(dto);
  }

  /**
   * GET /api/community/rooms/:roomId/posts
   * Obtener todas las publicaciones de una sala
   */
  @Get('rooms/:roomId/posts')
  findPostsByRoom(@Param('roomId') roomId: string) {
    return this.communityService.findPostsByRoom(roomId);
  }

  /**
   * DELETE /api/community/posts/:id
   * Eliminar una publicación
   */
  @Delete('posts/:id')
  removePost(@Param('id') id: string) {
    return this.communityService.removePost(id);
  }

  // ── Corazones ────────────────────────────────────────────────────

  /**
   * POST /api/community/posts/:postId/heart
   * Dar/quitar corazón a un post (toggle)
   * Body: { userId: string }
   */
  @Post('posts/:postId/heart')
  toggleHeart(
    @Param('postId') postId: string,
    @Body() dto: HeartPostDto,
  ) {
    return this.communityService.toggleHeart(postId, dto.userId);
  }
}
