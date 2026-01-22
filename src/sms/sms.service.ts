import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly baseUrl = 'https://notify.eskiz.uz/api';
  private token: string | null = null;

  constructor(private readonly httpService: HttpService) {}

  async login() {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/auth/login`, {
          email: process.env.ESKIZ_EMAIL,
          password: process.env.ESKIZ_PASSWORD,
        }),
      );
      this.token = response.data.data.token;
      this.logger.log('Eskiz: Yangi token olindi');
    } catch (error) {
      this.logger.error('Eskiz login xatosi', error.response?.data);
      throw new UnauthorizedException('Eskizga ulanib bo‘lmadi');
    }
  }

  async sendOtp(phone: string, code: string) {
    if (!this.token) await this.login();

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/message/sms/send`,
          {
            mobile_phone: phone.replace(/\+/g, ''),
            message: `Fixoo platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: ${code}. Kodni hech kimga bermang!`,
            from: '4546',
          },
          {
            headers: { Authorization: `Bearer ${this.token}` },
          },
        ),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        await this.login();
        return this.sendOtp(phone, code);
      }
      throw error;
    }
  }
}
