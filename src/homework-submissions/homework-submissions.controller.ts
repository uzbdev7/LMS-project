import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { HomeworkSubmissionsService } from './homework-submissions.service';
import { CreateSubmissionDto } from './dto/create-homework-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { RolesGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateSubmissionDto } from './dto/update-homework-submission.dto';

@ApiTags('Homework Submissions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('api/homework-submissions')
export class HomeworkSubmissionsController {
  constructor(private readonly submissionsService: HomeworkSubmissionsService) {}
  
  @Post()
  @Roles('ADMIN','STUDENT')
  @ApiOperation({ summary: 'Vazifa topshirish' })
  create(@Body() dto: CreateSubmissionDto, @Req() req: any) {
    return this.submissionsService.create(req.user.id, dto);
  }

  @Get('my')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN','STUDENT')
  @ApiOperation({ summary: 'Mening topshirgan vazifalarim' })
  findMy(@Req() req: any) {
    return this.submissionsService.findMySubmissions(req.user.id);
  }

  @Get('homework/:homeworkId')
  @Roles('ADMIN','STUDENT')
  @ApiOperation({ summary: 'Ma’lum bir vazifa bo‘yicha barcha topshiriqlarni olish (Admin/Teacher uchun)' })
  findByHomework(@Param('homeworkId', ParseIntPipe) homeworkId: number) {
    return this.submissionsService.findByHomework(homeworkId);
  }

  @Patch(':id')
  @Roles('STUDENT','ADMIN') 
  @ApiOperation({ summary: 'Topshirilgan vazifani tahrirlash' })
  @ApiResponse({ status: 200, description: 'Vazifa muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 401, description: 'Token xato yoki topilmadi' })
  @ApiResponse({ status: 403, description: 'Boshqa studentning vazifasini tahrirlash taqiqlanadi' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubmissionDto,
    @Req() req: any,
  ) {
    return this.submissionsService.update(id, req.user.id, dto);
  }
  
  @Patch('review/:id')
  @Roles('MENTOR','ADMIN')
  @ApiOperation({ summary: 'Vazifani tekshirish (statusni o‘zgartirish)' })
  review(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReviewSubmissionDto,
  ) {
    return this.submissionsService.review(id, dto);
  }
}