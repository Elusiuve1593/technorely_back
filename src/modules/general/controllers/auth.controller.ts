import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SignInDTO } from '../dto/auth/signIn.dto';
import { SignUpDTO } from '../dto/auth/signUp.dto';
import { TokenDTO } from '../dto/auth/token.dto';
import { Auth } from '../entity/auth.entity';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUp: SignUpDTO): Promise<{
    statusCode: number;
    message: string;
  }> {
    const existMail: Auth | null = await this.authService.existMail(
      signUp.email,
    );

    if (existMail) {
      throw new HttpException(
        `The ${existMail.email} has already exist!`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.authService.signUp(signUp);
  }

  @Post('sign-in')
  signIn(@Body() signIn: SignInDTO): Promise<TokenDTO | null> {
    return this.authService.signIn(signIn);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(
    @Headers('Authorization') token: string,
  ): Promise<{ message: string; statusCode: number }> {
    return this.authService.logout(token);
  }
}
