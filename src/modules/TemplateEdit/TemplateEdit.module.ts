import { Module } from '@nestjs/common';

import { EditImageController } from './TemplateEdit.controller';
import { EditImageService } from './TemplateEdit.service';

@Module({
  controllers: [EditImageController],
  providers: [EditImageService],
})
class EditImageModule {}

export { EditImageModule };
