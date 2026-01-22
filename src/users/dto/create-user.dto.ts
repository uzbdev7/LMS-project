import { ApiProperty, ApiHideProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MinLength } from "class-validator";
import { UserRole } from "generated/prisma/enums";

export class CreateUserDto {
  @ApiProperty({ example: 'Aziz', description: 'Foydalanuvchi ismi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Rahimov', description: 'Foydalanuvchi familiyasi' })
  @IsString()
  @IsNotEmpty()
  surname: string;
  
  @ApiProperty({ example: '+998901234567', description: 'O‘zbekiston telefon raqami' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UZ') 
  phone: string;

  @ApiProperty({ example: 'Password123!', description: 'Kamida 6 ta belgidan iborat parol' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.STUDENT })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class LoginDto {
  @ApiProperty({ example: '+998883700025' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Axrorbek123' })
  @IsString()
  @IsNotEmpty()
  pass: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1Ni...' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
export class RequestOtpDto {
  @ApiProperty({ example: '+998901234567', description: 'Foydalanuvchi telefon raqami' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  otpCode: string;

  @ApiProperty({ example: 'yangi_parol_123' })
  @IsString()
  @IsNotEmpty()
  newPass: string;
}