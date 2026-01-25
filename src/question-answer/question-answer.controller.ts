import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionAnswerService } from './question-answer.service';
import { CreateQuestionAnswerDto } from './dto/create-question-answer.dto';
import { UpdateQuestionAnswerDto } from './dto/update-question-answer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Question Answer')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('api/question-answer')
export class QuestionAnswerController {
  constructor(private readonly service: QuestionAnswerService) {}

  @Post()
  @Roles('ADMIN','MENTOR')
  @ApiOperation({ summary: 'Savolga javob yozish' })
  create(@GetUser() user: any, @Body() dto: CreateQuestionAnswerDto) {
    return this.service.create(user.id, dto);
  }

  @Get('question/:questionId')
  @Roles('STUDENT','ADMIN','MENTOR')
  @ApiOperation({ summary: 'ADMIN | STUDENT | MENTOR' })
  findByQuestion(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.service.findByQuestionId(questionId);
  }

  @Patch(':id')
  @Roles('ADMIN','MENTOR')
  @ApiOperation({ summary: 'ADMIN | MENTOR' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateQuestionAnswerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN','MENTOR')
  @ApiOperation({ summary: 'ADMIN | MENTOR' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}