import { Module } from '@nestjs/common';
import { DatabaseConfigureModule } from '../config/database.module';
import { GeneralModule } from './general/general.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [DatabaseConfigureModule, GeneralModule, CloudinaryModule],
})
export class AppModule {}
