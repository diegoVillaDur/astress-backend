import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) { }

  // ──────────────────────────────────────────────────────────────
  // SALAS (ROOMS)
  // ──────────────────────────────────────────────────────────────

  async createRoom(dto: CreateRoomDto) {
    const existing = await this.prisma.communityRoom.findUnique({
      where: { name: dto.name },
    });
    if (existing) throw new ConflictException('Ya existe una sala con ese nombre.');

    const room = await this.prisma.communityRoom.create({ data: dto });
    return { message: 'Sala creada.', room };
  }

  async findAllRooms() {
    const rooms = await this.prisma.communityRoom.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { posts: true } },
      },
    });
    return { rooms };
  }

  async findOneRoom(id: string) {
    const room = await this.prisma.communityRoom.findUnique({
      where: { id },
      include: {
        _count: { select: { posts: true } },
      },
    });
    if (!room) throw new NotFoundException('Sala no encontrada.');
    return room;
  }

  // ──────────────────────────────────────────────────────────────
  // PUBLICACIONES (POSTS / MURO DE APOYO)
  // ──────────────────────────────────────────────────────────────

  async createPost(dto: CreatePostDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    const room = await this.prisma.communityRoom.findUnique({ where: { id: dto.roomId } });
    if (!room) throw new NotFoundException('Sala no encontrada.');

    const post = await this.prisma.communityPost.create({
      data: {
        content: dto.content,
        isAnonymous: dto.isAnonymous ?? false,
        userId: dto.userId,
        roomId: dto.roomId,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
        room: {
          select: { id: true, name: true },
        },
        _count: { select: { hearts: true } },
      },
    });

    // Si es anónimo, ocultamos los datos del usuario en la respuesta
    const response = {
      ...post,
      user: post.isAnonymous ? null : post.user,
    };

    return { message: 'Publicación creada en el Muro de Apoyo.', post: response };
  }

  async findPostsByRoom(roomId: string) {
    const room = await this.prisma.communityRoom.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Sala no encontrada.');

    const posts = await this.prisma.communityPost.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { hearts: true } },
      },
    });

    // Ocultar datos del autor en posts anónimos
    const sanitized = posts.map((post) => ({
      ...post,
      user: post.isAnonymous ? null : post.user,
    }));

    return { roomId, room: room.name, totalPosts: sanitized.length, posts: sanitized };
  }

  // ──────────────────────────────────────────────────────────────
  // CORAZONES
  // ──────────────────────────────────────────────────────────────

  async toggleHeart(postId: string, userId: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Publicación no encontrada.');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    // Buscar si ya existe un corazón de este usuario en este post
    const existing = await this.prisma.postHeart.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      // Ya tiene corazón → quitarlo
      await this.prisma.postHeart.delete({
        where: { userId_postId: { userId, postId } },
      });
      const count = await this.prisma.postHeart.count({ where: { postId } });
      return { message: 'Corazón retirado.', hearts: count, liked: false };
    } else {
      // No tiene corazón → agregarlo
      await this.prisma.postHeart.create({ data: { userId, postId } });
      const count = await this.prisma.postHeart.count({ where: { postId } });
      return { message: '❤️ Corazón enviado.', hearts: count, liked: true };
    }
  }

  // ──────────────────────────────────────────────────────────────
  // ELIMINAR POST
  // ──────────────────────────────────────────────────────────────

  async removePost(id: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Publicación no encontrada.');

    await this.prisma.communityPost.delete({ where: { id } });
    return { message: 'Publicación eliminada.' };
  }
}
