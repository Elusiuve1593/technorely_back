import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesAuthGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/roles/roles.decorator';
import { UpdateCompanyDTO } from '../dto/companies/updateCompany.dto';
import { UpdateProfileDTO } from '../dto/profile/updateProfile.dto';
import { Auth } from '../entity/auth.entity';
import { Company } from '../entity/company.entity';
import { AdminService } from '../services/admin.service';

@UseGuards(AuthGuard, RolesAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles('admin')
  @Get()
  getUsersByAdmin(): Promise<Auth[]> {
    return this.adminService.getUsersByAdmin();
  }

  @Roles('admin')
  @Put(':id')
  updateUserByAdmin(
    @Param('id') id: number,
    @Body() updateUser: UpdateProfileDTO,
    @Headers('Authorization') token: string,
  ): Promise<UpdateProfileDTO> {
    return this.adminService.updateUserByAdmin(id, updateUser, token);
  }

  @Roles('admin')
  @Get('companies')
  getCompaniesByAdmin(): Promise<Company[]> {
    return this.adminService.getCompaniesByAdmin();
  }

  @Roles('admin')
  @Put('company/:id')
  async updateCompanyByAdmin(
    @Body() updateCompany: UpdateCompanyDTO,
    @Param('id') id: number,
    @Headers('Authorization') token: string,
  ): Promise<UpdateCompanyDTO> {
    try {
      return await this.adminService.updateCompanyByAdmin(
        id,
        updateCompany,
        token,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Company not found');
      }
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(
          'You do not have permission to update this company',
        );
      }
      throw new Error('An error occurred while updating the company');
    }
  }
}