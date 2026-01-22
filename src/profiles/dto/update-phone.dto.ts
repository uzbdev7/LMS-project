import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString, IsOptional } from "class-validator";

export class UpdatePhoneDto {
    @ApiPropertyOptional({ example: '+9981000110' })
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('UZ')
    phone: string;

    @ApiPropertyOptional({ example: '123456', description: 'OTP kod, faqat verify qilish uchun' })
    @IsOptional()
    @IsString()
    otp?: string; 
}
