import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findMyQuestions(userId: number) {
    return this.prisma.question.findMany({
      where: { userId },
      include: { course: true, answers: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.question.findMany({
      where: { courseId },
      include: { user: { select: { name: true, surname: true } }, answers: true },
    });
  }

  async markAsRead(id: number) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Savol topilmadi');

    return this.prisma.question.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}