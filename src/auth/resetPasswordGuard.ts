// guards/reset-password.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('توکن ارائه نشده است');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_RESET_SECRET });
      req['resetPayload'] = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('توکن نامعتبر یا منقضی شده است');
    }
  }
}
