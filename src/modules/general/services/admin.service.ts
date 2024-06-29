import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { TokenService } from 'src/common/token/token.service';
import { Repository } from 'typeorm';
import { UpdateCompanyDTO } from '../dto/companies/updateCompany.dto';
import { UpdateProfileDTO } from '../dto/profile/updateProfile.dto';
import { Auth } from '../entity/auth.entity';
import { Company } from '../entity/company.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly tokenService: TokenService,
  ) {}

  async getUsersByAdmin(): Promise<Auth[]> {
    const users = await this.authRepository.find({ relations: ['companies'] });

    if (!users) {
      throw new NotFoundException('Users not found or unauthorized');
    }
    
    const nonAdminUsers = users.filter((user) => !user.roles.includes('admin'));

    return plainToInstance(Auth, nonAdminUsers);
  }

  async updateUserByAdmin(
    id: number,
    updateUser: UpdateProfileDTO,
    token: string,
  ): Promise<UpdateProfileDTO> {
    const decodedToken: { sub: string; roles: string } =
      await this.tokenService.decoder(token);

    const isAdmin = decodedToken.roles.includes('admin');
    const isOwner = decodedToken.sub === id.toString();

    if (!(isAdmin || isOwner)) {
      throw new UnauthorizedException(
        'You are not authorized to update this user',
      );
    }

    const user = await this.authRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.authRepository.update(id, {
      ...updateUser,
      owner: isOwner ? decodedToken.sub : user.owner,
    });

    return updateUser;
  }

  async getCompaniesByAdmin(): Promise<Company[]> {
    const companiesByAdmin = await this.companyRepository.find({
      relations: ['auth'],
    });

    if (!companiesByAdmin) {
      throw new NotFoundException('Companies not found or unauthorized');
    }

    return plainToInstance(Company, companiesByAdmin);
  }

  async updateCompanyByAdmin(
    id: number,
    updateCompany: UpdateCompanyDTO,
    token: string,
  ): Promise<UpdateCompanyDTO> {
    const decodedToken: { sub: string; roles: string[] } =
      await this.tokenService.decoder(token);

    const user = await this.authRepository.findOne({
      where: { id: +decodedToken.sub },
      relations: ['companies'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['auth'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const isAdmin = decodedToken.roles.includes('admin');
    if (!isAdmin && company.auth.id !== user.id) {
      throw new UnauthorizedException(
        'You do not have permission to update this company',
      );
    }

    await this.companyRepository.update({ id }, { ...updateCompany });

    return updateCompany;
  }
}
