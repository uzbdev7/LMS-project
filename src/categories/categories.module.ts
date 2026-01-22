import { Module } from '@nestjs/common';
import { CourseCategoriesService } from './categories.service';
import { CourseCategoriesController } from './categories.controller';

@Module({
  controllers: [CourseCategoriesController],
  providers: [CourseCategoriesService],
})
export class CategoriesModule {}
