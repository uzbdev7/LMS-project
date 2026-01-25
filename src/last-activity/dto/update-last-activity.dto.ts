import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateLastActivityDto {
  @ApiProperty({ example: 'course-uuid-123' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  sectionId: number;

  @ApiProperty({ example: 'lesson-uuid-456' })
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({ example: '/courses/nest-js/lesson/1' })
  @IsUrl()
  @IsNotEmpty()
  url: string;
}