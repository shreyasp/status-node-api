import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { LayerService } from './TemplateImageLayer.service';

@Controller('layer')
class LayerController {
  constructor(private readonly layerService: LayerService) {}

  @Get(':id')
  findLayerForImage(@Param('id') id) {
    return this.layerService.getImageRelatedLayers(id);
  }

  @Post(':id')
  createUpdateTemplateLayer(@Param('id') id, @Body() layers) {
    return this.layerService
      .createUpdateTemplateLayers(id, layers)
      .then(() => ({ success: true, message: 'Layer Object created successfully' }))
      .catch(err => err);
  }
}

export { LayerController };
