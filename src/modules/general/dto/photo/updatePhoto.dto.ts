import {
    IsString
} from 'class-validator';

export class UpdatePhotoDTO {
  @IsString()
  image: string;
}
