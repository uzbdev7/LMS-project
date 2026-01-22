import { Injectable, BadRequestException, UnauthorizedException, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { SmsService } from 'src/sms/sms.service';
import { CreateUserDto, RefreshTokenDto, RequestOtpDto, ResetPasswordDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(dto: CreateUserDto) {
    const { phone, password } = dto;

    const existingUser = await this.prisma.user.findFirst({ where: { phone } });
    if (existingUser) throw new BadRequestException('Bu raqam allaqachon ro‘yxatdan o‘tgan');

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.cacheManager.set(
      `otp_${phone}`, 
      { ...dto, password: hashedPassword, otpCode }, 
      120000
    );

    await this.smsService.sendOtp(phone, otpCode);

    return { 
      status: 'success', 
      message: "Tasdiqlash kodi yuborildi", 
      phone 
    };
  }


  async verifyOtp(phone: string, code: string) {
    const cachedData: any = await this.cacheManager.get(`otp_${phone}`);

    if (!cachedData || cachedData.otpCode !== code) {
      throw new BadRequestException('Kod noto‘g‘ri yoki muddati tugagan');
    }

    const newUser = await this.prisma.user.create({
      data: {
        name: cachedData.name,
        surname: cachedData.surname,
        phone: cachedData.phone,
        password: cachedData.password,
        isVerified: true,
        role: cachedData.role || 'STUDENT',
      },
    });

    await this.cacheManager.del(`otp_${phone}`);

    return { 
      status: 'verified',
      message: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi", 
      userId: newUser.id 
    };
  }


async login(phone: string, pass: string) {
  const user = await this.prisma.user.findFirst({ where: { phone } });

  if (!user || !user.isVerified) {
    throw new UnauthorizedException('Profil topilmadi yoki tasdiqlanmagan');
  }

  const isMatch = await bcrypt.compare(pass, user.password);
  if (!isMatch) {
    throw new UnauthorizedException('Telefon raqam yoki parol xato');
  }

  const accessToken = jwt.sign(
    { id: user.id, role: user.role }, 
    process.env.JWT_SECRET as string,
    { expiresIn: '45m' } 
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' } 
  );

  return { 
    access_token: accessToken, 
    refresh_token: refreshToken, 
    user: { 
      id: user.id, 
      name: user.name, 
      role: user.role 
    } 
  };
}

async refreshToken(dto: RefreshTokenDto) {
  try {
    const payload = jwt.verify(dto.refreshToken, process.env.JWT_SECRET as string) as any;

    const user = await this.prisma.user.findUnique({ 
      where: { id: payload.id } 
    });

    if (!user) throw new UnauthorizedException('Foydalanuvchi topilmadi');

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '45m' }
    );

    return {
      access_token: newAccessToken,
    };
  } catch (e) {
    throw new UnauthorizedException('Refresh token yaroqsiz yoki muddati o‘tgan');
  }
}

async requestResetPassword(phone: string) {

  const user = await this.prisma.user.findFirst({ where: { phone } });
  if (!user) throw new BadRequestException('Bu raqamli foydalanuvchi topilmadi');

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  await this.cacheManager.set(
    `reset_otp_${phone}`, 
    { phone, otpCode }, 
    120000
  );

  await this.smsService.sendOtp(phone, otpCode);

  return { 
    status: 'success', 
    message: "Parolni tiklash kodi yuborildi", 
    phone 
  };
}

async confirmResetPassword(dto: ResetPasswordDto) {
  const { phone, otpCode, newPass } = dto;

  const cachedData: any = await this.cacheManager.get(`reset_otp_${phone}`);

  if (!cachedData || cachedData.otpCode !== otpCode) {
    throw new BadRequestException('Kod noto‘g‘ri yoki muddati o‘tgan');
  }

  const user = await this.prisma.user.findUnique({
    where: { phone: phone }
  });

  if (!user) {
    throw new BadRequestException('Bunday raqamli foydalanuvchi topilmadi');
  }

  const hashedPassword = await bcrypt.hash(newPass, 10);

  await this.prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  await this.cacheManager.del(`reset_otp_${phone}`);

  return { 
    status: 'success', 
    message: "Parol muvaffaqiyatli yangilandi. Endi login qilishingiz mumkin." 
  };
}

}