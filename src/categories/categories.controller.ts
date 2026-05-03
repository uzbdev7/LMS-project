import { 
  Controller, Post, Body, UseGuards, HttpCode, 
  HttpStatus, Get, Param, UseInterceptors, Put, 
  ParseIntPipe, Delete 
} from '@nestjs/common';
import { 
  ApiBearerAuth, ApiConsumes, ApiOperation, 
  ApiBody, ApiTags, ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { CourseCategoriesService } from './categories.service';
import { CreateCourseCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Categories')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Token xato yoki topilmadi' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/categories')
export class CourseCategoriesController {
  constructor(private readonly service: CourseCategoriesService) {}

  @Post('create')
  @Roles('ADMIN', 'SUPERADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Yangi kategoriya yaratish | ADMIN' })
  @ApiBody({ type: CreateCourseCategoryDto })
  @UseInterceptors(FileInterceptor('icon')) 
  async create(@Body() dto: CreateCourseCategoryDto) {
    return this.service.create(dto);
  }

  @Put('update/:id')
  @Roles('ADMIN','SUPERADMIN')
  @ApiOperation({ summary: 'Kategoriyani tahrirlash | ADMIN' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete('delete/:id')
  @Roles('ADMIN', 'SUPERADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Kategoriyani o‘chirish | ADMIN' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get('all')
  @Roles("SUPERADMIN",'ADMIN', 'STUDENT', 'ASSISTANT', 'MENTOR')
  @ApiOperation({ summary: 'Barcha kategoriyalarni olish => SUPERADMIN, ADMIN, STUDENT, MENTOR' })
  async getAll() {
    return this.service.findAll();
  }

  @Get('get/:id')
  @Roles('ADMIN', 'SUPERADMIN', 'STUDENT', 'ASSISTANT', 'MENTOR')
  @ApiOperation({ summary: 'Kategoriyani ID bo‘yicha olish | ADMIN' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}