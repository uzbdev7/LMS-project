import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLessonDto {
  @ApiProperty({ 
    example: 'NestJS asoslari', 
    description: 'Darsning nomi' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: 'Ushbu darsda controller va service haqida gaplashamiz', 
    description: 'Dars haqida batafsil ma’lumot' 
  })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({ 
    example: 3, 
    description: 'Dars tegishli bo‘lgan LessonGroup (bo‘lim) ID-si' 
  })
  @Type(() => Number)
  @IsInt() 
  @IsNotEmpty()
  groupId: number;

  @ApiProperty({ 
    type: 'string', 
    format: 'binary', 
    description: 'Cloudinary-ga yuklanadigan video fayl' 
  })
  video: any;
}