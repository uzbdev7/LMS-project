import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PurchasedCoursesService } from './purchased-courses.service';
import { CreatePurchasedCourseDto } from './dto/create-purchased-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Purchased Courses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/purchased-courses')
export class PurchasedCoursesController {
  constructor(private readonly service: PurchasedCoursesService) {}

  @Post()
  @Roles('STUDENT','ADMIN')
  @ApiOperation({ summary: 'Kursni sotib olish' })
  @ApiResponse({ status: 201, description: 'Kurs muvaffaqiyatli sotib olindi' })
  @ApiResponse({ status: 409, description: 'Kurs allaqachon sotib olingan' })
  create(
    @GetUser() user: any, 
    @Body() dto: CreatePurchasedCourseDto
  ) {
    return this.service.create(user.id, dto);
  }

  @Get('my')
  @Roles('STUDENT','ADMIN')
  @ApiOperation({ summary: 'Sotib olingan kurslarni ko\'rish' })
  findMy(@GetUser() user:any) {
    return this.service.findMyCourses(user.id);
  }
}