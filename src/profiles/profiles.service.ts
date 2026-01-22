import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { SmsService } from 'src/sms/sms.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { UpsertMentorProfileDto } from './dto/mentor-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}


async getMyProfile(userid: string) {
  const profile = await this.prisma.user.findUnique({
    where: {
      id: Number(userid), 
    },
  });

  if (!profile) {
    throw new NotFoundException('Profil topilmadi');
  }

  return {
    success: true,
    data: {
      id: profile.id,
      name: profile.name,
      surname:profile.surname,
      phone: profile.phone,
      role: profile.role,
      created_at: profile.created_at,
    },
  };
}

async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!profile) {
      throw new NotFoundException('Profil topilmadi');
    }

    const dataToUpdate: any = { ...updateProfileDto };

     if (updateProfileDto.password) {
    const saltRounds = 10;
    dataToUpdate.password = await bcrypt.hash(updateProfileDto.password, saltRounds);
  }

   const updatedProfile = await this.prisma.user.update({
    where: { id: Number(userId) },
    data: dataToUpdate,
  });

    return {
      success: true,
      data: {
        id: updatedProfile.id,
        name: updatedProfile.name,
        surname:updatedProfile.surname,
        phone: updatedProfile.phone,
        password:updatedProfile.password
      },
    };
  }


async updatePhone(userId: string, updatePhoneDto: UpdatePhoneDto) {
  const user = await this.prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) throw new NotFoundException('Bunday user mavjud emas.');

  const cacheKey = `otp_updatePhone_${user.id}`;
  const cached = await this.cacheManager.get<{ newPhone: string; otpCode: string }>(cacheKey);

  if (updatePhoneDto.otp) {
    if (!cached) throw new NotFoundException('OTP topilmadi yoki muddati o‘tgan.');
    if (cached.otpCode !== updatePhoneDto.otp.trim()) throw new BadRequestException('OTP noto‘g‘ri.');

    const updatedUser = await this.prisma.user.update({
      where: { id: Number(userId) },
      data: { phone: cached.newPhone },
    });

    await this.cacheManager.del(cacheKey);

    return {
      success: true,
      message: 'Telefon raqam muvaffaqiyatli yangilandi.',
      data: { id: updatedUser.id, phone: updatedUser.phone },
    };
  }

  if (cached && cached.newPhone === updatePhoneDto.phone) {
    return {
      success: true,
      message: 'Tasdiqlash kodi allaqachon avvalgi telefon raqamga yuborilgan.',
    };
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await this.cacheManager.set(cacheKey, { newPhone: updatePhoneDto.phone, otpCode }, 120000 );
  await this.smsService.sendOtp(user.phone, otpCode);

  return {
    success: true,
    message: 'Tasdiqlash kodi avvalgi telefon raqamga yuborildi.',
  };
}


async getMentorProfile(userId: number) {
  return this.prisma.mentorProfile.findUnique({
    where: { userId },
  });
}

async UpdateMentorProfile(
    userId: number,
    dto: UpsertMentorProfileDto,
  ) {
    const exist = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!exist) {
      throw new NotFoundException('Bunday user mavjud emas.');
    }

    const createDto = {
      userId,
      about: dto.about ?? '',
      job: dto.job ?? '',
      experience: dto.experience ?? 0,
      telegram: dto.telegram ?? '',
      instagram: dto.instagram ?? '',
      linkedin: dto.linkedin ?? '',
      facebook: dto.facebook ?? '',
      github: dto.github ?? '',
      website: dto.website ?? '',
    };

    const updateDto = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined),
    );

    const mentorProfile = await this.prisma.mentorProfile.upsert({
      where: { userId },
      update: updateDto,
      create: createDto,
    });

    return mentorProfile;
  }

  async getMentorProfiles(){
    return this.prisma.mentorProfile.findMany()
  }

  async FindById(userId:number){
    return this.prisma.mentorProfile.findUnique({
      where:{id: userId}
    })
  }
  
}


