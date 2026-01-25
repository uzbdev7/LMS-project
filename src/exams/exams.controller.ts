import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Exams')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'ADMIN' })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get('admin/lesson-group/:lessonGroupId')
  @Roles('ADMIN','MENTOR')
  @ApiOperation({ summary: 'ADMIN | MENTOR' })
  findAllAdmin(@Param('lessonGroupId', ParseIntPipe) sectionId: number) {
    return this.examsService.findForAdmin(sectionId);
  }

  @Get('student/lesson-group/:lessonGroupId')
  @Roles('STUDENT', 'ADMIN')
  @ApiOperation({ summary: 'STUDENT | ADMIN' })
  findAllStudent(@Param('lessonGroupId', ParseIntPipe) sectionId: number) {
    return this.examsService.findForStudent(sectionId);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'ADMIN' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateExamDto) {
    return this.examsService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'ADMIN' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.remove(id);
  }
}