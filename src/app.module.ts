import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoodModule } from './mood/mood.module';
import { DiaryModule } from './diary/diary.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { CommunityModule } from './community/community.module';
import { PhrasesModule } from './phrases/phrases.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    MoodModule,
    DiaryModule,
    RecommendationsModule,
    CommunityModule,
    PhrasesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
