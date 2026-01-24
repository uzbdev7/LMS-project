import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateHomeworkDto {
  @ApiProperty({ example: 'Vazifa: 12-mashqni bajarish', description: 'Uy vazifasi matni' })
  @IsString()
  @IsNotEmpty()
  task: string;

  @ApiProperty({ example: 'homework_v1.zip', description: 'Vazifa fayli (link yoki nomi)' })
  @IsString()
  @IsNotEmpty()
  file: string;

  @ApiProperty({ example: 'lesson-uuid-123', description: 'Darsning ID raqami' })
  @IsString()
  @IsNotEmpty()
  lessonId: string;
}