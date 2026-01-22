import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { SmsModule } from '../sms/sms.module';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'; // 👈 alohida import

@Module({
  imports: [
    HttpModule,
    NestCacheModule.register({ ttl: 120 }), // TTL sekundlarda
    UsersModule,
    PrismaModule,
    SmsModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
