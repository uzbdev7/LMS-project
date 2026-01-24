import { Controller, Post, Get, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@ApiTags('Homework')
@ApiBearerAuth()
@Controller('api/homeworks')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi uy vazifasi yaratish' })
  @ApiResponse({ status: 201, description: 'Muvaffaqiyatli yaratildi.' })
  @ApiResponse({ status: 404, description: 'Dars topilmadi.' })
  create(@Body() createHomeworkDto: CreateHomeworkDto) {
    return this.homeworksService.create(createHomeworkDto);
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Dars IDsi bo‘yicha vazifani olish' })
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.homeworksService.findByLesson(lessonId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Uy vazifasini tahrirlash' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHomeworkDto: UpdateHomeworkDto,
  ) {
    return this.homeworksService.update(id, updateHomeworkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Uy vazifasini o‘chirish' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.homeworksService.remove(id);
  }
}