import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { CloudinaryProvider } from '../../config/cloudinary.provider';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { BlackListService } from '../general/services/black-listed.service';
import { GeneralModule } from '../general/general.module';
import { BlackListedToken } from '../general/entity/blacklisted-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig),
    GeneralModule,
    TypeOrmModule.forFeature([BlackListedToken]),
  ],
  controllers: [CloudinaryController],
  providers: [
    CloudinaryProvider,
    CloudinaryService,
    JwtService,
    BlackListService,
  ],
})
export class CloudinaryModule {}
