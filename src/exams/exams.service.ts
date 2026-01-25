import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExamDto) {
    return this.prisma.exam.create({ data: dto });
  }

  // Admin uchun hamma ma'lumotlar (javobi bilan)
  async findForAdmin(sectionId: number) {
    return this.prisma.exam.findMany({
      where: { sectionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Talaba uchun: Javoblar (answer) ko'rsatilmasligi mumkin (ixtiyoriy mantiq)
  async findForStudent(sectionId: number) {
    const exams = await this.prisma.exam.findMany({
      where: { sectionId },
      select: {
        id: true,
        question: true,
        variantA: true,
        variantB: true,
        variantC: true,
        variantD: true,
        sectionId: true,
        // answer: false, // Talaba savolni ko'rganida javobni ko'rmasligi kerak
      },
    });
    return exams;
  }

  async update(id: number, dto: UpdateExamDto) {
    await this.findOne(id);
    return this.prisma.exam.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.exam.delete({ where: { id } });
  }

  private async findOne(id: number) {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    if (!exam) throw new NotFoundException('Imtihon savoli topilmadi');
    return exam;
  }
}