import { Module } from '@nestjs/common';
import { CourseController } from './courses.controller'; 
import { CoursesService } from './courses.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CourseController],
  providers: [CoursesService, PrismaService],
})
export class CoursesModule {}
