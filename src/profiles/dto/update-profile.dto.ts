import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Aziz', description: 'Foydalanuvchi ismi' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ example: 'Karimov', description: 'Foydalanuvchi familiyasi' })
  @IsString()
  @IsOptional()
  readonly surname?: string;

  @ApiPropertyOptional({ example: '+998901234567', description: 'Telefon raqami' })
  @IsString()
  @IsOptional()
  readonly phone?: string;

  @ApiPropertyOptional({ example: 'newpassword123', description: 'Parol (agar o‘zgartirilsa)' })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Parol kamida 6 ta belgi bo‘lishi kerak' })
  @MaxLength(20, { message: 'Parol maksimal 20 ta belgi bo‘lishi mumkin' })
  readonly password?: string;
}
