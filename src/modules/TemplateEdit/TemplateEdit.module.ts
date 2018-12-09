import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigModule } from '../AppConfig/AppConfig.module';
import { Font } from '../TemplateFont/TemplateFont.entity';
import { Image } from '../TemplateImage/TemplateImage.entity';
import { Layer } from '../TemplateImageLayer/TemplateImageLayer.entity';
import { EditImageController } from './TemplateEdit.controller';
import { EditImageService } from './TemplateEdit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Layer, Image, Font]), AppConfigModule],
  controllers: [EditImageController],
  providers: [EditImageService],
})
class EditImageModule {}

export { EditImageModule };
