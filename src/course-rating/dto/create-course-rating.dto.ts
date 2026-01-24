// create-rating.dto.ts
import { IsInt, IsString, Min, Max, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 5, description: '1 dan 5 gacha baho' })
  @IsInt()
  @Min(1)
  @Max(5)
  rate: number;

  @ApiProperty({ example: 'Judayam foydali kurs!', description: 'Izoh' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ example: 'course-uuid-123', description: 'Kursning UUID id-si' })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}

// update-rating.dto.ts
import { PartialType } from '@nestjs/swagger';
export class UpdateRatingDto extends PartialType(CreateRatingDto) {}