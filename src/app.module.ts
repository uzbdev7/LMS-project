import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 1. Buni import qiling
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { SmsModule } from './sms/sms.module'; 
import { ProfilesModule } from './profiles/profiles.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 2. Buni barcha modullar ko'rishi uchun qo'shing
    }),
    PrismaModule, 
    SmsModule,
    UsersModule,
    ProfilesModule,
    CategoriesModule,  
  ],
  controllers: [AppController], 
  providers: [AppService],    
})
export class AppModule {}