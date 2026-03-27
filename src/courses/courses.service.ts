import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

// Reusable include — DRY prinsipi
const SECTION_INCLUDE = {
  sectionLesson: {
    orderBy: { id: 'asc' as const },
    include: {
      lesson: {
        orderBy: { created_at: 'asc' as const },
      },
    },
  },
} as const;

const COURSE_BASE_INCLUDE = {
  mentor: { select: { id: true, name: true, surname: true } },
  category: { select: { id: true, name: true } },
} as const;

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseDto & { banner: string; introVideo?: string }) {
    return this.prisma.course.create({ data });
  }

  async update(
    id: string,
    data: UpdateCourseDto & { banner?: string; introVideo?: string },
  ) {
    return this.prisma.course.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async getAll(query: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search?.trim()) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          ...COURSE_BASE_INCLUDE,
          ...SECTION_INCLUDE,   // ← QO'SHILDI
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        ...COURSE_BASE_INCLUDE,
        ...SECTION_INCLUDE,   // ← allaqachon to'g'ri edi, saqlanadi
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    return course;
  }

  async remove(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    await this.prisma.course.delete({ where: { id } });

    return { message: `Course with id ${id} successfully deleted` };
  }

  async getMentorByIdCourses(
    mentorId: number,
    query: { page: number; limit: number; search?: string },
  ) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { mentorId };
    if (search?.trim()) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          ...COURSE_BASE_INCLUDE,
          ...SECTION_INCLUDE,   // ← QO'SHILDI
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getMentorCourses(
    mentorId: number,
    query: { page: number; limit: number; search?: string },
  ) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { mentorId };
    if (search?.trim()) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          ...COURSE_BASE_INCLUDE,
          ...SECTION_INCLUDE,   // ← QO'SHILDI
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}