import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios'; 
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SmsService } from 'src/sms/sms.service'; 
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [

    HttpModule, 

    CacheModule.register({
      ttl: 120000, 
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService, 
    SmsService, 
    PrismaService
  ],
  exports: [UsersService],
})
export class UsersModule {}