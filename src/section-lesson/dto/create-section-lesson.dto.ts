// dto/create-section-lesson.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSectionLessonDto {
  @ApiProperty({ example: '1-boʻlim: Kirish', description: 'Boʻlim nomi' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'course-uuid-123', description: 'Kursning UUID ID-si' })
  @IsNotEmpty()
  @IsString()
  courseId: string;
}

