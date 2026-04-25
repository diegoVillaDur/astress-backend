import {
    Injectable,
    ConflictException,
    UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    // ── REGISTRO ──────────────────────────────────────────────
    async register(dto: RegisterDto) {
        // 1. Verificar que el correo no esté registrado
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });

        if (existing) {
            throw new ConflictException('Ya existe una cuenta con este correo');
        }

        // 3. Crear usuario
        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                name: dto.name.trim(),
                password: dto.password,
                career: dto.career?.trim() ?? null,
                semester: dto.semester ?? null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                career: true,
                semester: true,
                createdAt: true,
            },
        });

        return {
            message: '¡Bienvenido ',
            user,
        };
    }

    // ── LOGIN ─────────────────────────────────────────────────
    async login(dto: LoginDto) {
        // 1. Buscar usuario
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });

        if (!user) {
            throw new UnauthorizedException('Correo o contraseña incorrectos');
        }

        if (dto.password != user.password) {
            throw new UnauthorizedException('Correo o contraseña incorrectos');
        }

        return {
            message: 'Sesión iniciada correctamente',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                career: user.career,
                semester: user.semester,
            },
        };
    }

    // ── PERFIL ────────────────────────────────────────────────
    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                career: true,
                semester: true,
                createdAt: true,
                _count: {
                    select: { moodEntries: true },
                },
            },
        });

        if (!user) throw new UnauthorizedException('Usuario no encontrado');

        return user;
    }
}
