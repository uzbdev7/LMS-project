import { Controller, Post, Body, UploadedFiles, UseInterceptors, UseGuards, Patch, Param, UploadedFile, ParseIntPipe, Get, Delete, Req, Query } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateCourseDto } from './dto/create-course.dto';
import { CoursesService } from './courses.service';
import { courseCloudStorage } from '../common/cloudinary-storage';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateCourseDto } from './dto/update-course.dto';
import { retry } from 'rxjs';

@ApiTags('Courses')
@Controller('api/')
export class CourseController {
  constructor(private readonly courseService: CoursesService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary:'ADMIN'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        banner: { type: 'string', format: 'binary' },
        introVideo: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        about: { type: 'string' },
        price: { type: 'number' },
          level: { 
        type: 'string',
        enum: ['BEGINNER', 'PRE_INTERMEDIATE', 'INTERMEDIATE', 'UPPER_INTERMEDIATE', 'ADVANCED'], 
        },
        categoryId: { type: 'number' },
        mentorId: { type: 'number' },
        published: { type: 'boolean' },
      },
      required: ['banner', 'name', 'about', 'price', 'level', 'categoryId', 'mentorId'],
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'banner', maxCount: 1 },
        { name: 'introVideo', maxCount: 1 },
      ],
      { storage: courseCloudStorage },
    ),
  )
  async createCourse(
    @UploadedFiles() files: { banner?: Express.Multer.File[]; introVideo?: Express.Multer.File[] },
    @Body() dto: CreateCourseDto,
  ) {
    const bannerUrl = files.banner ? files.banner[0].path : null;
    const introVideoUrl = files.introVideo ? files.introVideo[0].path : null;

  return this.courseService.create({
    ...dto,
    banner: bannerUrl,
    introVideo: introVideoUrl
  } as any);
    }

  @Patch('course/update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        banner: { type: 'string', format: 'binary' },
        introVideo: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        about: { type: 'string' },
        price: { type: 'number' },
        level: { 
          type: 'string',
          enum: ['BEGINNER', 'PRE_INTERMEDIATE', 'INTERMEDIATE', 'UPPER_INTERMEDIATE', 'ADVANCED'],
        },
        categoryId: { type: 'number' },
        mentorId: { type: 'number' },
        published: { type: 'boolean' },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'banner', maxCount: 1 },
        { name: 'introVideo', maxCount: 1 },
      ],
      { storage: courseCloudStorage },
    ),
  )
  async updateCourse(
    @Param('id') id: string,
    @UploadedFiles() files: { banner?: Express.Multer.File[]; introVideo?: Express.Multer.File[] },
    @Body() dto: UpdateCourseDto,
  ) {
    const bannerUrl = files.banner ? files.banner[0].path : undefined;
    const introVideoUrl = files.introVideo ? files.introVideo[0].path : undefined;

    return this.courseService.update(id, {
      ...dto,
      banner: bannerUrl,
      introVideo: introVideoUrl,
      
    });
  }

@Get('get/course/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STUDENT', 'ASSISTANT', 'MENTOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN | STUDENT | ASSISTANT | MENTOR' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Sahifa raqami' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Har bir sahifadagi elementlar soni' })
  @ApiQuery({ name: 'search', required: false, example: 'Kiberxavsizlik', description: 'Kurs nomi bo‘yicha qidiruv' })
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.courseService.getAll({ 
      page: page ? Number(page) : 1, 
      limit: limit ? Number(limit) : 10, 
      search: search || ''
    });
  }

  @Get('course/get/:id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary:'ADMIN'})
  async getById(@Param('id') id: string) {
    return this.courseService.findOne(id)
  }

  @Delete('course/delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN' })
  async removeCourse(@Param('id') id: string) {
    return this.courseService.remove(id);
  }

@Get('get/course/mentor/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') 
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  async getCoursesByMentor(
    @Param('id') id: string, 
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.courseService.getMentorByIdCourses(
      Number(id), 
      {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        search: search || '',
      },
    );
  }

  @Get('mentor/courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MENTOR','ADMIN') 
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'MENTOR | ADMIN' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  async getMyCourses(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const mentorId = req.user.id;

    return this.courseService.getMentorCourses(
      Number(mentorId), 
      {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        search: search || '',
      },
    );
  }
}





