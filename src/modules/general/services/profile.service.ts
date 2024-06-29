import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { TokenService } from 'src/common/token/token.service';
import { Repository } from 'typeorm';
import { UpdateProfileDTO } from '../dto/profile/updateProfile.dto';
import { Auth } from '../entity/auth.entity';
import { UpdatePhotoDTO } from '../dto/photo/updatePhoto.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly tokenService: TokenService,
  ) {}

  async oneProfile(id: number, token: string): Promise<Auth> {
    const decodedToken: { sub: string } =
      await this.tokenService.decoder(token);

    const user = await this.authRepository.findOne({
      relations: ['companies'],
      where: { id, owner: decodedToken.sub },
    });

    if (!user) {
      throw new NotFoundException('User not found or unauthorized');
    }
    return plainToClass(Auth, user);
  }

  async updateProfile(
    id: number,
    updateUser: UpdateProfileDTO,
    token: string,
  ): Promise<UpdateProfileDTO> {
    const decodedToken: { sub: string } =
      await this.tokenService.decoder(token);

    const user = await this.authRepository.findOne({
      relations: ['companies'],
      where: { id, owner: decodedToken.sub },
    });

    if (!user) {
      throw new NotFoundException('User not found or unauthorized');
    }

    this.authRepository.update(id, {
      ...updateUser,
      owner: decodedToken.sub,
    });

    return updateUser;
  }

  async updatePhotoProfile(
    id: number,
    updatePhoto: UpdatePhotoDTO,
    token: string,
  ): Promise<string> {
    const decodedToken: { sub: string } =
      await this.tokenService.decoder(token);

    const user = await this.authRepository.findOne({
      relations: ['companies'],
      where: { id, owner: decodedToken.sub },
    });

    if (!user) {
      throw new NotFoundException('User not found or unauthorized');
    }

    await this.authRepository.update(id, {
      ...updatePhoto,
      owner: decodedToken.sub,
    });

    return updatePhoto.image;
  }
}