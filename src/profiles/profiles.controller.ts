import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/role.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { UpsertMentorProfileDto } from './dto/mentor-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Profile')
@Controller('api')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService,
    private readonly prismaService:PrismaService
  ) {}

  @Get('profile/me')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard,RolesGuard)
    @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi profili',
    schema: {
      example: {
        success: true,
        data: {},
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token yoq yoki notogri' })
  async getMyProfile(@GetUser() user: any) {
    const userId = user.sub || user.id;

    return this.profilesService.getMyProfile(userId);
  }

@Patch('profile/me/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('application/json') 
  @ApiBody({ type: UpdateProfileDto })
  updateMyProfile(
    @GetUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    console.log(updateProfileDto); 
    return this.profilesService.updateProfile(user.id, updateProfileDto);
  }

  @Patch('profile/me/update/phone')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'MENTOR | STUDENT | ASSISTANT'})
  @ApiBody({ type: UpdatePhoneDto })
  async updatePhone(
    @GetUser() user: any,
    @Body() updatePhoneDto: UpdatePhoneDto
  ) {
    return this.profilesService.updatePhone(user.id, updatePhoneDto);
  }

@Get('profile/mentor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('MENTOR')
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'MENTOR'})
async mentorProfile(@GetUser() user: any) {
  const userId = user.id || user.sub;
  return this.profilesService.getMentorProfile(userId)
}

@Put('profile/mentor/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MENTOR','ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'MENTOR | ADMIN' })
  @ApiBody({ type: UpsertMentorProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Mentor profile muvaffaqiyatli yangilandi',
  })
  async updateMentorProfile(
    @GetUser('id') user: any,
    @Body() dto: UpsertMentorProfileDto,
  ) {
    const userId = user.id || user.sub
    return this.profilesService.UpdateMentorProfile(userId, dto);
  }

  @Get('profile/all/mentor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN'})
  async mentorProfiles() {
    return this.profilesService.getMentorProfiles()
  }

  @Get('profile/mentor/:id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary:'ADMIN'})
  async getById(@Param('id') id: string) {
  const userId = parseInt(id, 10);
    return this.profilesService.FindById(userId)
  }

}