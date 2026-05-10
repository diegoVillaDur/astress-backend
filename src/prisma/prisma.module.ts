import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Disponible en toda la app sin necesidad de reimportarlo
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
