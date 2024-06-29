import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConfig } from 'src/config/jwt.config';
import { BlackListService } from 'src/modules/general/services/black-listed.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private blackListService: BlackListService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const isBlackListed = await this.blackListService.isTokenBlackListed(token);
    if (isBlackListed) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    try {
      const options = await jwtConfig.useFactory();
      const payload = await this.jwtService.verifyAsync(token, {
        secret: options.secret,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
