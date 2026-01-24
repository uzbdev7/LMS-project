import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLessonDto {
  @ApiProperty({ example: 'Lesson 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Lesson about topic' })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({ example: 3, description: 'Guruh ID-si' })
  @Type(() => Number)
  @IsNotEmpty()
  groupId: number;
 
  @ApiProperty({ type: 'string', format: 'binary', description: 'Video faylni tanlang' })
  video: any;
}