import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access token topilmadi yoki noto‘g‘ri formatda');
    }

    const token = authHeader.split(' ')[1];

    let payload: any;
    try {

      payload = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      throw new UnauthorizedException('Yaroqsiz yoki muddati otgan token');
    }

    request.user = payload;

    if (requiredRoles.length > 0 && !requiredRoles.includes(payload.role)) {
      throw new ForbiddenException('Bu amalni bajarish uchun sizda ruxsat mavjud emas.');
    }

    return true;
  }
}