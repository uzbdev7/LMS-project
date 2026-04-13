import { 
  Controller, Post, Body, HttpCode, HttpStatus, 
  UseInterceptors, UseGuards, 
  Req,
  Get,
  Patch,
  Param,
  ParseIntPipe
} from '@nestjs/common'; 
import { 
  ApiTags, ApiOperation, ApiConsumes, 
  ApiBody, ApiBearerAuth,  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express'; 

import { UsersService } from './users.service';
import { 
  CreateUserDto, VerifyOtpDto, LoginDto, 
  RefreshTokenDto, ResetPasswordDto, RequestOtpDto,
  UpdateUserRoleDto
} from './dto/create-user.dto';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Users') 
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@Post('api/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: "Ro'yxatdan o'tish" })
  @ApiBody({ type: CreateUserDto })
  @UseInterceptors(FileInterceptor('')) 
  async register(@Body() createUserDto: CreateUserDto) {
    createUserDto.role = UserRole.STUDENT;
    return this.usersService.register(createUserDto);
  }
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data') 
  @ApiOperation({ summary: "STUDENT | MENTOR | ADMIN | ASSISTANT" })
  @ApiBody({ type: LoginDto })
  @UseInterceptors(FileInterceptor(''))
  async login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto.phone, loginDto.pass);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data') 
  @ApiOperation({ summary: "VERIFY OTP" })
  @ApiBody({ type: VerifyOtpDto })   
  @UseInterceptors(FileInterceptor('')) 
  async verify(@Body() verifyDto: VerifyOtpDto) {
    return this.usersService.verifyOtp(verifyDto.phone, verifyDto.code);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: "Access tokenni yangilash" })
  @ApiBody({ type: RefreshTokenDto })
  @UseInterceptors(FileInterceptor('')) 
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.usersService.refreshToken(dto);
  }

  @Post('reset-password/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Parolni tiklash uchun OTP so‘rash' })
  async requestReset(@Body() body: RequestOtpDto) {
    return this.usersService.requestResetPassword(body.phone);
  }

  @Post('reset-password/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'OTPni tasdiqlash va yangi parolni o‘rnatish' })
  async confirmReset(@Body() dto: ResetPasswordDto) {
    return this.usersService.confirmResetPassword(dto);
  }

  @Get('get/all/student')
  @ApiOperation({ summary: 'Hamma darslar royhati.' })
  async getAll() {
    return this.usersService.getAll();
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN | SUPERADMIN)' })
  async updateRoleById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateUserRoleById(id, dto.role);
  }
}