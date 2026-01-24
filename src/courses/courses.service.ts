import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseDto & { banner: string; introVideo?: string }) {
    return this.prisma.course.create({
      data,
    });
  }

 async update(
  id: string,
  data: UpdateCourseDto & { banner?: string; introVideo?: string },
) {
  return this.prisma.course.update({
    where: { id },
    data: {
      ...data,
      updatedAt:new Date()
    },

  });
}


async getAll(query: { page: number; limit: number; search?: string }) {
  const { page, limit, search } = query;


  const skip = (page - 1) * limit;


  const where: any = {};
  if (search && search.trim() !== '') {
    where.name = { 
      contains: search, 
      mode: 'insensitive' 
    };
  }

  const [courses, total] = await Promise.all([
    this.prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        mentor: { select: { name: true } },
        category: { select: { name: true } },
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
  const category = await this.prisma.course.findUnique({
    where:{id: id}
  })

  if(!category){
    throw new NotFoundException('course not found.')
  }

  return category
}

async remove(id: string) {
  const category = await this.prisma.course.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundException(`Course with id ${id} not found`);
  }

  await this.prisma.course.delete({
    where: { id },
  });

  return {
    message: `Course with id ${id} successfully deleted`,
  };
}

async getMentorByIdCourses(
    mentorId: number, 
    query: { page: number; limit: number; search?: string }
  ) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      mentorId: mentorId,
    };

    if (search && search.trim() !== '') {
      where.name = { 
        contains: search, 
        mode: 'insensitive' 
      };
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true } },
          mentor: { select: { name: true } },
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

async getMentorCourses(
    mentorId: number, 
    query: { page: number; limit: number; search?: string }
  ) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      mentorId: mentorId, 
    };

    if (search && search.trim() !== '') {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true } },
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