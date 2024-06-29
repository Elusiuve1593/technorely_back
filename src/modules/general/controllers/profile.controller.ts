import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesAuthGuard } from 'src/common/guards/roles.guard';
import { UpdateProfileDTO } from '../dto/profile/updateProfile.dto';
import { Auth } from '../entity/auth.entity';
import { ProfileService } from '../services/profile.service';
import { UpdatePhotoDTO } from '../dto/photo/updatePhoto.dto';

@UseGuards(AuthGuard, RolesAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: ProfileService) {}

  @Get(':id')
  oneProfile(
    @Param('id') id: number,
    @Headers('Authorization') token: string,
  ): Promise<Auth> {
    return this.userService.oneProfile(id, token);
  }

  @Put(':id')
  updateProfile(
    @Param('id') id: number,
    @Body() updateUser: UpdateProfileDTO,
    @Headers('Authorization') token: string,
  ): Promise<UpdateProfileDTO> {
    return this.userService.updateProfile(id, updateUser, token);
  }

  @Patch(':id')
  async updatePhotoProfile(
    @Param('id') id: number,
    @Body() updatePhoto: UpdatePhotoDTO,
    @Headers('Authorization') token: string,
  ): Promise<string> {
    try {
      const updatedPhoto = await this.userService.updatePhotoProfile(
        id,
        updatePhoto,
        token,
      );
      return updatedPhoto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
    }
  }
}
