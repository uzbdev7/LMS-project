import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class UpsertMentorProfileDto {
  @ApiPropertyOptional({ example: 'Backend mentor, 5+ years experience' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({ example: 'Senior Backend Developer' })
  @IsOptional()
  @IsString()
  job?: string;

  @ApiPropertyOptional({ example: 5, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @ApiPropertyOptional({ example: 'https://t.me/username' })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/username' })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/username' })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/username' })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://github.com/username' })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiPropertyOptional({ example: 'https://mywebsite.com' })
  @IsOptional()
  @IsUrl()
  website?: string;
}
