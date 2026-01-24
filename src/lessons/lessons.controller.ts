import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/role.guard';

@ApiTags('Lessons')
@Controller('api/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Yangi dars yaratish (Cloudinary orqali)' })
  @UseInterceptors(FileInterceptor('video'))
  async create(
    @Body() dto: CreateLessonDto, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.lessonsService.create(dto, file);
  }

  @Get('detail/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Dars tafsilotlari' })
  getDetail(@Param('id') id: string) {
    return this.lessonsService.getDetail(id);
  }

  @Get('single/:lessonId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Bitta dars ma’lumotlari' })
  getSingle(@Param('lessonId') lessonId: string) {
    return this.lessonsService.getSingle(lessonId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Darsni tahrirlash' })
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Darsni oʻchirib tashlash' })
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}