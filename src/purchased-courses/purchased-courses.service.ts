import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchasedCourseDto } from './dto/create-purchased-course.dto';

@Injectable()
export class PurchasedCoursesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreatePurchasedCourseDto) {
  
    const existingPurchase = await this.prisma.purchasedCourse.findUnique({
      where: {
        userId_courseId: { userId, courseId: dto.courseId },
      },
    });

    if (existingPurchase) {
      throw new ConflictException('Siz bu kursni allaqachon sotib olgansiz');
    }

    return this.prisma.purchasedCourse.create({
      data: {
        userId,
        ...dto,
      },
      include: { course: true },
    });
  }

  async findMyCourses(userId: number) {
    return this.prisma.purchasedCourse.findMany({
      where: { userId },
      include: {
        course: {
          select: { id: true, name: true, about: true, price: true },
        },
      },
      orderBy: { purchasedAt: 'desc' },
    });
  }
}