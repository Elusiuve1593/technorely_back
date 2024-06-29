import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { jwtConfig } from 'src/config/jwt.config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { Auth } from './entity/auth.entity';
import { BlackListedToken } from './entity/blacklisted-token.entity';
import { BlackListService } from './services/black-listed.service';
import { TokenService } from 'src/common/token/token.service';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { Company } from './entity/company.entity';
import { CompanyController } from './controllers/company.controller';
import { CompanyService } from './services/company.service';
import { RolesAuthGuard } from 'src/common/guards/roles.guard';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, Company, BlackListedToken]),
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [
    AdminController,
    AuthController,
    ProfileController,
    CompanyController,
  ],
  providers: [
    AuthService,
    BcryptService,
    BlackListService,
    TokenService,
    AuthGuard,
    RolesAuthGuard,
    ProfileService,
    AdminService,
    CompanyService,
  ],
})
export class GeneralModule {}
