import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto, UpdateRatingDto } from './dto/create-course-rating.dto';

@Injectable()
export class CourseRatingService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateRatingDto) {
    return this.prisma.rating.create({
      data: { ...dto, userId },
    });
  }

  async findAllByCourse(courseId: string) {
    return this.prisma.rating.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new NotFoundException('Reyting topilmadi');
    return rating;
  }

  async update(id: number, userId: number, dto: UpdateRatingDto) {
    const rating = await this.findOne(id);
    if (rating.userId !== userId) {
      throw new ForbiddenException('Siz faqat ozingizning reytingingizni tahrirlay olasiz');
    }
    return this.prisma.rating.update({ where: { id }, data: dto });
  }

  async remove(id: number, userId: number) {
    const rating = await this.findOne(id);
    if (rating.userId !== userId) {
      throw new ForbiddenException('Siz faqat ozingizning reytingingizni ochira olasiz');
    }
    return this.prisma.rating.delete({ where: { id } });
  }
}