import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQuestionAnswerDto {
  @ApiProperty({ example: 1, description: 'Savolning ID si' })
  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @ApiProperty({ example: 'Bu savolga javob: ...', description: 'Javob matni' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'https://file-link.com/image.png', required: false })
  @IsString()
  @IsOptional()
  file?: string;
}