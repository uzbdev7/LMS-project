import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LessonViewService } from './lesson-view.service';
import { UpdateLessonViewDto } from './dto/update-lesson-view.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/role.guard';

@ApiTags('Lesson Views')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/lesson-view')
export class LessonViewController {
  constructor(private readonly lessonViewService: LessonViewService) {}

  @Patch()
  @Roles('STUDENT', 'ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Dars ko‘rilganlik holatini yangilash' })
  @ApiResponse({ status: 200, description: 'Holat yangilandi' })
  updateView(@Body() dto: UpdateLessonViewDto, @Req() req: any) {
    return this.lessonViewService.toggleView(req.user.id, dto);
  }

  @Get()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Barcha dars ko‘rishlar statistikasi (Admin/Teacher)' })
  findAll() {
    return this.lessonViewService.findAll();
  }

  @Get('my')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Mening ko‘rgan darslarim tarixi' })
  findMy(@Req() req: any) {
    return this.lessonViewService.findMyViews(req.user.id);
  }
}