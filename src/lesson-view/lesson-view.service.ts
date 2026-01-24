import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLessonViewDto } from './dto/update-lesson-view.dto';

@Injectable()
export class LessonViewService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleView(userId: number, dto: UpdateLessonViewDto) {
    const lesson = await this.prisma.lessons.findUnique({
      where: { id: dto.lessonId },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    return this.prisma.lessonView.upsert({
      where: {
        lessonId_userId: {
          lessonId: dto.lessonId,
          userId: userId,
        },
      },
      update: { view: dto.view },
      create: {
        lessonId: dto.lessonId,
        userId: userId,
        view: dto.view,
      },
    });
  }

  async findAll() {
    return this.prisma.lessonView.findMany({
      include: { lesson: true, user: true },
    });
  }

  async findMyViews(userId: number) {
    return this.prisma.lessonView.findMany({
      where: { userId },
      include: { lesson: true },
    });
  }
}