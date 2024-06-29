import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  async decoder(token: string) {
    return this.jwtService.verifyAsync(token.split(' ')[1]);
  }
}
