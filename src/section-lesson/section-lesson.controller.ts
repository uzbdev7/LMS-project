import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SectionLessonService } from './section-lesson.service';
import { CreateSectionLessonDto } from './dto/create-section-lesson.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { UpdateSectionLessonDto } from './dto/update-section-lesson.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Lesson Groups')
@Controller('api/lesson-groups')
export class SectionLessonController {
  constructor(private readonly sectionService: SectionLessonService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yangi boʻlim (guruh) yaratish' })
  create(@Body() dto: CreateSectionLessonDto) {
    return this.sectionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha boʻlimlar roʻyxatini olish' })
  findAll() {
    return this.sectionService.findAll();
  }

  @Get('all/:courseId')
  @ApiOperation({ summary: 'Bitta kursga tegishli barcha boʻlimlarni koʻrish' })
  findAllByCourse(@Param('courseId') courseId: string) {
    return this.sectionService.findAllByCourse(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Boʻlimni ID boʻyicha koʻrish' })
  findOne(@Param('id') id: string) {
    return this.sectionService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Boʻlimni tahrirlash' })
  update(@Param('id') id: string, @Body() dto: UpdateSectionLessonDto) {
    return this.sectionService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Boʻlimni oʻchirib tashlash' })
  remove(@Param('id') id: string) {
    return this.sectionService.remove(+id);
  }
}