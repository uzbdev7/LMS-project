import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Questions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('api/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}
  
  @Post()
  @Roles('STUDENT')
  @ApiOperation({ summary: 'STUDENT' })
  create(@GetUser() user: any, @Body() dto: CreateQuestionDto) {
    return this.questionsService.create(user.id, dto);
  }

  @Get('my')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'STUDENT' })
  findMy(@GetUser() user: any) {
    return this.questionsService.findMyQuestions(user.id);
  }

  @Get('course/:courseId')
  @Roles('STUDENT', 'ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'STUDENT | ADMIN | MENTOR' })
  findByCourse(@Param('courseId') courseId: string) {
    return this.questionsService.findByCourse(courseId);
  }

  @Patch(':id/read')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: "ADMIN | MENTOR" })
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.markAsRead(id);
  }
}