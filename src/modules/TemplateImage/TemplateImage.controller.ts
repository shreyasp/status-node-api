import { Body, Controller, Get, Param, Post, Put, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor, UseInterceptors } from '@nestjs/common';

import { TemplateImageDTO } from './dto/TemplateImage.dto';
import { ImageService } from './TemplateImage.service';

@Controller('image')
class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  getAllImages(): object {
    return this.imageService.findAllImages();
  }

  @Get(':id')
  getImage(@Param('id') id): object {
    return this.imageService.findOneImage(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  createImage(@Body() imageName, @Body() categoryId, @UploadedFiles() images) {
    return this.imageService.createImage(imageName, categoryId, images);
  }

  @Put(':id')
  toggleImageActive(@Param('id') id) {
    return this.imageService.toggleImageActive(id);
  }
}

export { ImageController };
