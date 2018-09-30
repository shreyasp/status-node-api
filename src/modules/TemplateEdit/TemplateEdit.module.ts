import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Layer } from '../TemplateImageLayer/TemplateImageLayer.entity';
import { EditImageController } from './TemplateEdit.controller';
import { EditImageService } from './TemplateEdit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Layer])],
  controllers: [EditImageController],
  providers: [EditImageService],
})
class EditImageModule {}

export { EditImageModule };
