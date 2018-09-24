import { Body, Controller, Param, Post } from '@nestjs/common';

import { EditImageService } from './TemplateEdit.service';

@Controller('edit')
class EditImageController {
  constructor(private readonly editImageService: EditImageService) {}

  @Post(':id')
  editImage(@Param('id') id, @Body() imageLayerData) {
    return this.editImageService.editImage(imageLayerData);
  }
}

export { EditImageController };
