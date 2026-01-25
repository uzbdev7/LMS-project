import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ExamAnswer } from '@prisma/client'; // Prisma enumdan olinadi

export class CreateExamDto {
  @ApiProperty({ example: 'NestJS nima?', description: 'Savol matni' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: 'Framework', description: 'Variant A' })
  @IsString()
  @IsNotEmpty()
  variantA: string;

  @ApiProperty({ example: 'Library', description: 'Variant B' })
  @IsString()
  @IsNotEmpty()
  variantB: string;

  @ApiProperty({ example: 'Language', description: 'Variant C' })
  @IsString()
  @IsNotEmpty()
  variantC: string;

  @ApiProperty({ example: 'Database', description: 'Variant D' })
  @IsString()
  @IsNotEmpty()
  variantD: string;

  @ApiProperty({ enum: ExamAnswer, example: 'A', description: 'To’g’ri javob' })
  @IsEnum(ExamAnswer)
  @IsNotEmpty()
  answer: ExamAnswer;

  @ApiProperty({ example: 1, description: 'Bo’lim (SectionLesson) ID si' })
  @IsInt()
  @IsNotEmpty()
  sectionId: number;
}