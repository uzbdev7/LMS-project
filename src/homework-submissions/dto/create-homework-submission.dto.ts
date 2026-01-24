import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({ example: 'Vazifa yechimi haqida matn' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'solution_file.zip' })
  @IsString()
  @IsNotEmpty()
  file: string;

  @ApiProperty({ example: 'O‘z vaqtida topshirdim' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  homeworkId: number;
}