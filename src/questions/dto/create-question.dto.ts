import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ example: 'course-uuid-123', description: 'Kursning UUID ID si' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ example: 'Ushbu darsning 2-daqiqasidagi tushunchani tushunmadim', description: 'Savol matni' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'https://file-link.com/image.png', required: false, description: 'Savolga biriktirilgan rasm yoki fayl' })
  @IsString()
  @IsOptional()
  file?: string;
}