import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateLessonViewDto {
  @ApiProperty({ example: 'lesson-uuid-123', description: 'Darsning ID raqami' })
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({ example: true, description: 'Ko‘rilganlik holati' })
  @IsBoolean()
  view: boolean;
}