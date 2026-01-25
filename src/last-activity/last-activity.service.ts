import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLastActivityDto } from './dto/update-last-activity.dto';

@Injectable()
export class LastActivityService {
  constructor(private prisma: PrismaService) {}

  async updateLastActivity(userId: number, dto: UpdateLastActivityDto) {

    return this.prisma.lastActivity.upsert({
      where: { userId },
      update: {
        courseId: dto.courseId,
        sectionId: dto.sectionId,
        lessonId: dto.lessonId,
        url: dto.url,
        updatedAt: new Date(),
      },
      create: {
        userId,
        courseId: dto.courseId,
        sectionId: dto.sectionId,
        lessonId: dto.lessonId,
        url: dto.url,
      },
    });
  }

  async findOne(userId: number) {
    const activity = await this.prisma.lastActivity.findUnique({
      where: { userId },
      include: {
        course: { select: { name: true, categoryId: true } },
        lesson: { select: { name: true, sectionId: true } },
      },
    });

    if (!activity) {
      throw new NotFoundException('Ushbu foydalanuvchi uchun faoliyat topilmadi');
    }
    return activity;
  }

  async findAll() {
    return this.prisma.lastActivity.findMany({
      include: {
        user: { select: { id: true, name: true, surname:true, phone: true, role: true, isVerified: true } },
        course: true,
      },
    });
  }

  async findByUserId(userId: number) {
    return this.findOne(userId);
  }
}