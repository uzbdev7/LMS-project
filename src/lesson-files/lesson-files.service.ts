import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonFileDto } from './dto/create-lesson-file.dto';
import { UpdateLessonFileDto } from './dto/update-lesson-file.dto';

@Injectable()
export class LessonFilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLessonFileDto: CreateLessonFileDto) {
    return this.prisma.lessonFile.create({
      data: createLessonFileDto,
    });
  }

  async findByLesson(lessonId: string) {
    return this.prisma.lessonFile.findMany({
      where: { lessonId },
    });
  }

  async update(id: number, updateLessonFileDto: UpdateLessonFileDto) {
    await this.findOne(id);
    return this.prisma.lessonFile.update({
      where: { id },
      data: updateLessonFileDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); 
    return this.prisma.lessonFile.delete({
      where: { id },
    });
  }

  private async findOne(id: number) {
    const file = await this.prisma.lessonFile.findUnique({ where: { id } });
    if (!file) throw new NotFoundException(`File with ID ${id} not found`);
    return file;
  }
}