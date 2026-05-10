import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MoodModule } from './mood/mood.module';
import { QuotesModule } from './quotes/quotes.module';
import { JournalModule } from './journal/journal.module';

@Module({
  imports: [AuthModule, PrismaModule, MoodModule, QuotesModule, JournalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
