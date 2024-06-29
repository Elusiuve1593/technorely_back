import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesAuthGuard } from 'src/common/guards/roles.guard';
import { CreateCompanyDTO } from '../dto/companies/createCompany.dto';
import { UpdateCompanyDTO } from '../dto/companies/updateCompany.dto';
import { Company } from '../entity/company.entity';
import { CompanyService } from '../services/company.service';

@UseGuards(AuthGuard, RolesAuthGuard)
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post(':id')
  createCompany(
    @Body() createCompany: CreateCompanyDTO,
    @Param('id') id: number,
    @Headers('Authorization') token: string,
  ): Promise<Company> {
    return this.companyService.createCompany(id, createCompany, token);
  }

  @Get()
  getCompanies(
    @Headers('Authorization') token: string,
    @Query('sortBy') sortBy: string,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Company[]> {
    return this.companyService.getCompanies(token, sortBy, order);
  }

  @Get(':id')
  getCompany(
    @Param('id') id: number,
    @Headers('Authorization') token: string,
  ): Promise<Company> {
    return this.companyService.getCompany(id, token);
  }

  @Put(':id')
  async updateCompany(
    @Body() updateCompany: UpdateCompanyDTO,
    @Param('id') id: number,
    @Headers('Authorization') token: string,
  ): Promise<UpdateCompanyDTO> {
    try {
      return await this.companyService.updateCompany(id, updateCompany, token);
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

  @Delete(':id')
  async deleteCompany(
    @Param('id') id: number,
    @Headers('Authorization') token: string,
  ): Promise<void> {
    try {
      await this.companyService.deleteCompany(id, token);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Company not found');
      }
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(
          'You do not have permission to delete this company',
        );
      }
      throw new Error('An error occurred while deleting the company');
    }
  }
}
