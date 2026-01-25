import { 
  Controller, Get, Body, Patch, Param, 
  UseGuards, Put, ParseIntPipe 
} from '@nestjs/common';
import { 
  ApiBearerAuth, ApiBody, ApiConsumes, 
  ApiOperation, ApiResponse, ApiTags, 
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';

import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { UpsertMentorProfileDto } from './dto/mentor-profile.dto';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Profile')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Token yoq yoki notogri' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/profile') 
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Joriy foydalanuvchi profilini olish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli', schema: { example: { success: true, data: {} } } })
  async getMyProfile(@GetUser() user: any) {
    return this.profilesService.getMyProfile(user.id);
  }

  @Patch('me/update')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Profil ma’lumotlarini yangilash' })
  @ApiBody({ type: UpdateProfileDto })
  async updateMyProfile(
    @GetUser() user: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(user.id, dto);
  }

  @Patch('me/update/phone')
  @ApiOperation({ summary: 'Telefon raqamini yangilash | MENTOR, STUDENT, ASSISTANT' })
  async updatePhone(
    @GetUser() user: any,
    @Body() dto: UpdatePhoneDto
  ) {
    return this.profilesService.updatePhone(user.id, dto);
  }

  @Get('mentor')
  @Roles('MENTOR')
  @ApiOperation({ summary: 'Mentor o’z profilini ko’rishi | MENTOR' })
  async mentorProfile(@GetUser() user: any) {
    return this.profilesService.getMentorProfile(user.id);
  }

  @Put('mentor/update')
  @Roles('MENTOR', 'ADMIN')
  @ApiOperation({ summary: 'Mentor profilini yaratish yoki yangilash | MENTOR, ADMIN' })
  @ApiResponse({ status: 200, description: 'Mentor profili muvaffaqiyatli yangilandi' })
  async updateMentorProfile(
    @GetUser() user: any,
    @Body() dto: UpsertMentorProfileDto,
  ) {
    return this.profilesService.UpdateMentorProfile(user.id, dto);
  }

  @Get('all/mentor')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Barcha mentorlar ro’yxatini olish | ADMIN' })
  async mentorProfiles() {
    return this.profilesService.getMentorProfiles();
  }

  @Get('mentor/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Mentor profilini ID bo’yicha olish | ADMIN' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.FindById(id);
  }
}