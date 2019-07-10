import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigModule } from '../AppConfig/AppConfig.module';
import { ImageController } from './TemplateImage.controller';
import { Image } from './TemplateImage.entity';
import { ImageService } from './TemplateImage.service';
import { WizardPage } from '../TemplateWizardPage/TemplateWizardPage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, WizardPage]), AppConfigModule],
  controllers: [ImageController],
  providers: [ImageService],
})
class TemplateImageModule {}

export { TemplateImageModule };
