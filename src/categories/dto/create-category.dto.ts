import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseCategoryDto {
  @ApiProperty({ example: 'Web Development' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
