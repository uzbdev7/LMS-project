import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CourseRatingService } from './course-rating.service';
import { CreateRatingDto, UpdateRatingDto } from './dto/create-course-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/role.guard';

@ApiTags('CourseRating')
@Controller('api/course-rating')
export class CourseRatingController {
  constructor(private readonly ratingService: CourseRatingService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT') 
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yangi reyting qoldirish' })
  create(@Req() req: any, @Body() dto: CreateRatingDto) {
    return this.ratingService.create(req.user.id, dto);
  }

  @Get('list/:courseId')
  @ApiOperation({ summary: 'Bitta kursga tegishli barcha reytinglarni koʻrish' })
  findAll(@Param('courseId') courseId: string) {
    return this.ratingService.findAllByCourse(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Reytingni ID boʻyicha koʻrish' })
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Oʻz reytingini tahrirlash' })
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateRatingDto) {
    return this.ratingService.update(+id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT', 'ADMIN') 
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Oʻz reytingini oʻchirib tashlash' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.ratingService.remove(+id, req.user.id);
  }
  
}