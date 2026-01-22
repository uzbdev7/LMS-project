import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseCategoriesService {
  constructor(private readonly prisma: PrismaService){}

 async  create(Dto: CreateCourseCategoryDto) {
    return  await this.prisma.courseCategory.create({
      data:{
        name:Dto.name
      }
    })
  }

  async findAll() {
    return await this.prisma.courseCategory.findMany()
  }

  async findOne(id: number) {
    const category = await this.prisma.courseCategory.findUnique({
      where:{id: id}
    })

    if(!category){
      throw new NotFoundException('Category not found.')
    }

    return category
  }


async update(id: number, updateCategoryDto: UpdateCategoryDto) {

  const category = await this.prisma.courseCategory.findUnique({ where: { id } });
  if (!category) {
    throw new NotFoundException(`Category with id ${id} not found`);
  }

  return this.prisma.courseCategory.update({
    where: { id },
    data: {
      ...updateCategoryDto,
    },
  });
}

async remove(id: number) {

  const category = await this.prisma.courseCategory.findUnique({ where: { id } });
  if (!category) {
    throw new NotFoundException(`Category with id ${id} not found`);
  }

   this.prisma.courseCategory.delete({
    where: { id },
  });

   return { message: `Category with id ${id} successfully deleted` };
}



}
