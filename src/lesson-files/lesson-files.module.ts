import { Module } from '@nestjs/common';
import { LessonFilesService } from './lesson-files.service';
import { LessonFilesController } from './lesson-files.controller';

@Module({
  controllers: [LessonFilesController],
  providers: [LessonFilesService],
})
export class LessonFilesModule {}
