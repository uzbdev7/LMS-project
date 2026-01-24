import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer'; // 👈 qo‘shildi
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ example: 'NestJS Backend' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Backend kursi haqida to‘liq ma’lumot' })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({ enum: CourseLevel })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number) 
  categoryId: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Type(() => Number) 
  mentorId: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @Type(() => Boolean) 
  published?: boolean;
}
