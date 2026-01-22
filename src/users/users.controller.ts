import { Controller, Post, Body, HttpCode, HttpStatus, UseInterceptors, UseGuards } from '@nestjs/common'; 
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express'; 
import { UsersService } from './users.service';
import { CreateUserDto, VerifyOtpDto, LoginDto, RefreshTokenDto, ResetPasswordDto, RequestOtpDto } from './dto/create-user.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserRole } from 'generated/prisma/enums';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Users') 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('api/register')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('')) 
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: "ADMIN | STUDENT" })
  @ApiBody({ type: CreateUserDto })
  async register(
    @Body() createUserDto: CreateUserDto, 
    @GetUser() currentUser: any
  ) {
    if (createUserDto.role === UserRole.MENTOR || createUserDto.role === UserRole.ASSISTANT) {
      if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        createUserDto.role = UserRole.STUDENT;
      }
    } else {
      createUserDto.role = createUserDto.role || UserRole.STUDENT;
    }
    return this.usersService.register(createUserDto);
  }

  @Post('api/verify')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RolesGuard)
  @Roles('ADMIN','ASSISTANT','MENTOR','STUDENT')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('')) 
  @ApiConsumes('multipart/form-data') 
  @ApiOperation({ summary: "SMS kodni tasdiqlash" })
  @ApiBody({ type: VerifyOtpDto })   
  async verify(@Body() verifyDto: VerifyOtpDto) {
    return this.usersService.verifyOtp(verifyDto.phone, verifyDto.code);
  }

  @Post('api/login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor(''))
  @ApiConsumes('multipart/form-data') 
  @ApiOperation({ summary: "ADMIN | ASSISTANT | MENTOR" })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto.phone, loginDto.pass);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('')) 
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: "Access tokenni yangilash (Refresh token orqali)" })
  @ApiBody({ type: RefreshTokenDto })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.usersService.refreshToken(dto);
  }

  @Post('reset-password/request')
  @ApiOperation({ summary: 'Parolni tiklash uchun OTP so‘rash' })
  async requestReset(@Body() body: RequestOtpDto) {
    return this.usersService.requestResetPassword(body.phone);
  }

  @Post('reset-password/confirm')
  @ApiOperation({ summary: 'OTPni tasdiqlash va yangi parolni o‘rnatish' })
  async confirmReset(@Body() dto: ResetPasswordDto) {
    return this.usersService.confirmResetPassword(dto);
  }
}