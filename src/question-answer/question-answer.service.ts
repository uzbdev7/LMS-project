import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionAnswerDto } from './dto/create-question-answer.dto';
import { UpdateQuestionAnswerDto } from './dto/update-question-answer.dto';

@Injectable()
export class QuestionAnswerService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateQuestionAnswerDto) {
    const existingAnswer = await this.prisma.questionAnswer.findUnique({
      where: { questionId: dto.questionId },
    });

    if (existingAnswer) {
      throw new ConflictException('Ushbu savolga allaqachon javob berilgan');
    }

    return this.prisma.questionAnswer.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findByQuestionId(questionId: number) {
    const answer = await this.prisma.questionAnswer.findUnique({
      where: { questionId },
      include: { user: { select: { name: true, surname: true, role: true } } },
    });

    if (!answer) throw new NotFoundException('Ushbu savolga hali javob yozilmagan');
    return answer;
  }

  async update(id: number, dto: UpdateQuestionAnswerDto) {
    await this.findById(id);

    return this.prisma.questionAnswer.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    await this.findById(id);
    return this.prisma.questionAnswer.delete({ where: { id } });
  }

  private async findById(id: number) {
    const answer = await this.prisma.questionAnswer.findUnique({ where: { id } });
    if (!answer) throw new NotFoundException('Javob topilmadi');
    return answer;
  }
}