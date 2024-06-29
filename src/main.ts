import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { adminInfo } from './common/admin_info/admin-info';
import { AppModule } from './modules/app.module';
import { AuthService } from './modules/general/services/auth.service';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const authService = app.get(AuthService);
  await authService.createAdmin(adminInfo);

  await app.listen(3000);
}
bootstrap();
