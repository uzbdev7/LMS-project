import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaidVia } from '@prisma/client'; 

export class CreatePurchasedCourseDto {
  @ApiProperty({ example: 'course-uuid-123', description: 'Kursning ID si' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ example: 99.99, description: 'To’lov summasi', required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ enum: PaidVia, example: 'CLICK', description: 'To’lov turi' })
  @IsEnum(PaidVia)
  @IsNotEmpty()
  paidVia: PaidVia;
}