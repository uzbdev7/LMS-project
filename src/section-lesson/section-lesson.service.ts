import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionLessonDto } from './dto/create-section-lesson.dto';
import { UpdateSectionLessonDto } from './dto/update-section-lesson.dto';

@Injectable()
export class SectionLessonService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSectionLessonDto) {
    return this.prisma.sectionLesson.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.sectionLesson.findMany({
      include: { _count: { select: { lesson: true } } },
    });
  }

  async findAllByCourse(courseId: string) {
    return this.prisma.sectionLesson.findMany({
      where: { courseId },
      orderBy: { createdAt: 'asc' },
      include: {
        lesson: true,
      },
    });
  }

  async findOne(id: number) {
    const section = await this.prisma.sectionLesson.findUnique({
      where: { id },
      include: { lesson: true },
    });
    if (!section) throw new NotFoundException('Boʻlim topilmadi');
    return section;
  }

  async update(id: number, dto: UpdateSectionLessonDto) {
    await this.findOne(id);
    return this.prisma.sectionLesson.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.sectionLesson.delete({
      where: { id },
    });
  }
}