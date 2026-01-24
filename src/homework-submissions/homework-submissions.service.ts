import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-homework-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { UpdateSubmissionDto } from './dto/update-homework-submission.dto';

@Injectable()
export class HomeworkSubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateSubmissionDto) {
  
    const homework = await this.prisma.homework.findUnique({
      where: { id: dto.homeworkId },
    });
    if (!homework) throw new NotFoundException('Homework not found');

    return this.prisma.homeworkSubmission.create({
      data: { ...dto, userId },
      include: { submition: true, user: true },
    });
  }

  async findMySubmissions(userId: number) {
    return this.prisma.homeworkSubmission.findMany({
      where: { userId },
      include: { submition: true },
    });
  }

  async findByHomework(homeworkId: number) {
  
    return this.prisma.homeworkSubmission.findMany({
      where: { homeworkId },
      include: { user: true },
    });
  }

async update(id: number, userId: number, dto: UpdateSubmissionDto) {

    const submission = await this.prisma.homeworkSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException(`IDsi ${id} bo'lgan topshiriq topilmadi`);
    }
    
    if (submission.userId !== userId) {
      throw new ForbiddenException('Siz faqat o‘zingiz yuborgan vazifani tahrirlay olasiz!');
    }

    return this.prisma.homeworkSubmission.update({
      where: { id },
      data: {
        text: dto.text,
        file: dto.file,
        updatedAt: new Date(),
      },
    });
  }

  async review(id: number, dto: ReviewSubmissionDto) {
    return this.prisma.homeworkSubmission.update({
      where: { id },
      data: { 
        status: dto.status, 
        reason: dto.reason, 
        updatedAt: new Date() 
      },
    });
  }
}