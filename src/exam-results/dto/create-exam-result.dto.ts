import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsObject } from 'class-validator';

class UserAnswer {
  @ApiProperty({ example: 1 })
  @IsInt()
  questionId: number;

  @ApiProperty({ example: 'variantA' })
  @IsNotEmpty()
  answer: string;
}

export class SubmitExamDto {
  @ApiProperty({ example: 1, description: 'Bo’lim (Section) ID si' })
  @IsInt()
  @IsNotEmpty()
  sectionId: number;

  @ApiProperty({ type: [UserAnswer], description: 'Foydalanuvchi javoblari' })
  @IsArray()
  answers: UserAnswer[];
}