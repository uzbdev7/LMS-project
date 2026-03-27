import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import cloudinary from '../common/cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

private async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new BadRequestException('Video fayl yuklanmagan'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'lessons_videos',
      },
      (error, result) => {

        if (error) return reject(error);

        if (!result) {
          return reject(new Error('Cloudinary-dan javob qaytmadi'));
        }

        resolve(result.secure_url);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

  async create(dto: CreateLessonDto, file: Express.Multer.File) {

    const videoUrl = await this.uploadToCloudinary(file);

    return this.prisma.lessons.create({
      data: {
        name: dto.name,
        about: dto.about,
        video: videoUrl,
        sectionId: Number(dto.groupId),
      },
    });
  }

  async getDetail(id: string) {
    const lesson = await this.prisma.lessons.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Dars topilmadi');
    return lesson;
  }

  async getAll() {
    const lesson = await this.prisma.lessons.findMany();
    if (!lesson) throw new NotFoundException('Dars topilmadi');
    return {
      success:true,
      data:lesson
    };
    
  }

  async getSingle(lessonId: string) {
    const lesson = await this.prisma.lessons.findUnique({
      where: { id: lessonId },
      include: { lesson: true },
    });
    if (!lesson) throw new NotFoundException('Dars topilmadi');
    return lesson;
  }

async update(id: string, dto: UpdateLessonDto) {

  await this.getDetail(id);

  const { groupId, ...rest } = dto;

  return this.prisma.lessons.update({
    where: { id },
    data: {
      ...rest,
      ...(groupId && { sectionId: Number(groupId) }), 
      updatedAt: new Date(),
    },
  });
}

  async remove(id: string) {
    const lesson = await this.getDetail(id);
    return this.prisma.lessons.delete({ where: { id } });
  }
}