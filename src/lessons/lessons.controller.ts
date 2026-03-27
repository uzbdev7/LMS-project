import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, ApiOperation, ApiBearerAuth, 
  ApiConsumes, ApiUnauthorizedResponse 
} from '@nestjs/swagger';

import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Lessons')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Token xato yoki topilmadi' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @Roles('ADMIN', 'MENTOR')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'ADMIN | MENTOR' })
  @UseInterceptors(FileInterceptor('video'))
  async create(
    @Body() dto: CreateLessonDto, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.lessonsService.create(dto, file);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'ADMIN | MENTOR' })
  async update(
    @Param('id') id: string, 
    @Body() dto: UpdateLessonDto
  ) {
    return this.lessonsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'ADMIN | MENTOR' })
  async remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Dars tafsilotlari.' })
  async getDetail(@Param('id') id: string) {
    return this.lessonsService.getDetail(id);
  }

  @Get('get/all')
  @ApiOperation({ summary: 'Hamma darslar royhati.' })
  async getAll() {
    return this.lessonsService.getAll();
  }

  @Get('single/:lessonId')
  @ApiOperation({ summary: 'Bitta dars ma’lumotlarini olish' })
  async getSingle(@Param('lessonId') lessonId: string) {
    return this.lessonsService.getSingle(lessonId);
  }
}