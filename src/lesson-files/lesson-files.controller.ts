import { Controller, Post, Get, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LessonFilesService } from './lesson-files.service';
import { CreateLessonFileDto } from './dto/create-lesson-file.dto';
import { UpdateLessonFileDto } from './dto/update-lesson-file.dto';
import { RolesGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Lesson Files')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth('JWT-auth') 
@Controller('api/lesson-files')
export class LessonFilesController {
  constructor(private readonly lessonFilesService: LessonFilesService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi fayl yuklash' })
  @ApiResponse({ status: 201, description: 'Muvaffaqiyatli yaratildi.' })
  create(@Body() createLessonFileDto: CreateLessonFileDto) {
    return this.lessonFilesService.create(createLessonFileDto);
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Darsga tegishli barcha fayllarni olish' })
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.lessonFilesService.findByLesson(lessonId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Fayl ma’lumotlarini yangilash' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonFileDto: UpdateLessonFileDto,
  ) {
    return this.lessonFilesService.update(id, updateLessonFileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Faylni o‘chirish' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonFilesService.remove(id);
  }
}