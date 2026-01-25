import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitExamDto } from './dto/create-exam-result.dto';

@Injectable()
export class ExamResultsService {
  constructor(private prisma: PrismaService) {}

  async submit(userId: number, dto: SubmitExamDto) {
    const { sectionId, answers } = dto;

    const questions = await this.prisma.exam.findMany({
      where: { sectionId },
    });

    if (questions.length === 0) {
      throw new NotFoundException('Ushbu bo’limda savollar topilmadi');
    }

    let corrects = 0;
    let wrongs = 0;

    questions.forEach((q) => {
      const userAns = answers.find((a) => a.questionId === q.id);
      if (userAns && userAns.answer === q.answer) {
        corrects++;
      } else {
        wrongs++;
      }
    });

    const passed = (corrects / questions.length) * 100 >= 60;

    return this.prisma.examResult.create({
      data: {
        userId,
        sectionId,
        corrects,
        wrongs,
        passed,
      },
      include: { sectionExam: true },
    });
  }

  async findMyResults(userId: number) {
    return this.prisma.examResult.findMany({
      where: { userId },
      include: { sectionExam: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySection(sectionId: number) {
    return this.prisma.examResult.findMany({
      where: { sectionId },
      include: { user: { select: { name: true, surname: true, phone: true } } },
    });
  }
}