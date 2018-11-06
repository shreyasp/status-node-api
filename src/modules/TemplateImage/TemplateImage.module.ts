import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageController } from './TemplateImage.controller';
import { Image } from './TemplateImage.entity';
import { ImageService } from './TemplateImage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImageController],
  providers: [ImageService],
})
class TemplateImageModule {}

export { TemplateImageModule };
