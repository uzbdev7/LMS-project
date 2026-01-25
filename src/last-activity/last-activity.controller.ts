import { Controller, Get, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LastActivityService } from './last-activity.service';
import { UpdateLastActivityDto } from './dto/update-last-activity.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { RolesGuard } from 'src/auth/role.guard';


@ApiTags('Last Activity')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('api/last-activity')
export class LastActivityController {
  constructor(private readonly lastActivityService: LastActivityService) {}

  @Patch()
  @ApiOperation({ summary: 'Oxirgi faoliyatni saqlash/yangilash' })
  update(
    @GetUser() user: any, 
    @Body() updateDto: UpdateLastActivityDto
  ) {
    return this.lastActivityService.updateLastActivity(user.id, updateDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Joriy foydalanuvchi faoliyatini olish' })
  findMe(@GetUser() user: any) {
    return this.lastActivityService.findOne(user.id);
  }

  @Get()
  @Roles('ADMIN') 
  @ApiOperation({ summary: 'Barcha foydalanuvchilar faoliyatini olish' })
  findAll() {
    return this.lastActivityService.findAll();
  }

  @Get(':userId')
  @Roles('ADMIN')
  @ApiOperation({ summary: "ID bo'yicha (boshqa) foydalanuvchini ko'rish" })
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.lastActivityService.findByUserId(userId);
  }
}
