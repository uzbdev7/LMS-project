import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExamResultsService } from './exam-results.service';
import { SubmitExamDto } from './dto/create-exam-result.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/role.guard';

@ApiTags('Exam Results')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('api/exam-results')
export class ExamResultsController {
  constructor(private readonly service: ExamResultsService) {}

  @Post('submit')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'STUDENT' })
  submit(@GetUser() user: any, @Body() dto: SubmitExamDto) {
    return this.service.submit(user.id, dto);
  }

  @Get('my')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'STUDENT' })
  findMy(@GetUser() user: any) {
    return this.service.findMyResults(user.id);
  }

  @Get('lesson-group/:lessonGroupId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'ADMIN' })
  findBySection(@Param('lessonGroupId', ParseIntPipe) sectionId: number) {
    return this.service.findBySection(sectionId);
  }
}