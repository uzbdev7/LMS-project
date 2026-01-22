import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access token topilmadi yoki noto‘g‘ri formatda');
    }

    const token = authHeader.split(' ')[1];

    try {

      const payload = jwt.verify(token, process.env.JWT_SECRET as string);
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token yaroqsiz yoki muddati o‘tgan');
    }
  }
}
