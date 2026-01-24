import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@Injectable()
export class HomeworksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateHomeworkDto) {

    const lesson = await this.prisma.lessons.findUnique({
      where: { id: dto.lessonId },
    });
    if (!lesson) throw new NotFoundException(`Lesson with ID ${dto.lessonId} not found`);

    const existingHomework = await this.prisma.homework.findUnique({
      where: { lessonId: dto.lessonId },
    });
    if (existingHomework) throw new ConflictException('This lesson already has a homework');

    return this.prisma.homework.create({ data: dto });
  }

  async findByLesson(lessonId: string) {
    const homework = await this.prisma.homework.findUnique({
      where: { lessonId },
    });
    if (!homework) throw new NotFoundException('Homework not found for this lesson');
    return homework;
  }

  async update(id: number, dto: UpdateHomeworkDto) {
    await this.exists(id);
    return this.prisma.homework.update({
      where: { id },
      data: { ...dto, updateAt: new Date() },
    });
  }

  async remove(id: number) {
    await this.exists(id);
    return this.prisma.homework.delete({ where: { id } });
  }

  private async exists(id: number) {
    const homework = await this.prisma.homework.findUnique({ where: { id } });
    if (!homework) throw new NotFoundException(`Homework with ID ${id} not found`);
    return homework;
  }
}