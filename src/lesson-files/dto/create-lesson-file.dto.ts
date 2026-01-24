import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLessonFileDto {
  @ApiProperty({ example: 'https://example.com/file.pdf', description: 'Fayl manzili' })
  @IsString()
  @IsNotEmpty()
  file: string;

  @ApiProperty({ example: 'Mavzu bo‘yicha qo‘shimcha material', description: 'Fayl haqida izoh' })
  @IsString()
  @IsNotEmpty()
  note: string;

  @ApiProperty({ example: 'lesson-123', description: 'Darsning ID raqami' })
  @IsString()
  @IsNotEmpty()
  lessonId: string;
}