import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile } from '@nestjs/common';
import { FileInterceptor, UseInterceptors } from '@nestjs/common';

import { TemplateImageDTO } from './dto/TemplateImage.dto';
import { ImageService } from './TemplateImage.service';

@Controller('image')
class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  getAllImages(@Query() query): object {
    return this.imageService.findAllImages(query.page);
  }

  @Get('/getTrendingImages')
  getTrendingImages(@Query() query): object {
    return this.imageService.getTrendingImages(query.page);
  }

  @Get(':id')
  getImage(@Param('id') id): object {
    return this.imageService.findOneImage(id);
  }

  @Get('/byCategory/:categoryId')
  getImagesByCategory(@Param('categoryId') categoryId): object {
    return this.imageService.findImageByCategoryId(categoryId);
  }

  @Post()
  createImage(@Body() reqBody) {
    return this.imageService.createImage(reqBody.imageName, reqBody.categoryId);
  }

  @Put(':id/background/:uniqName')
  @UseInterceptors(FileInterceptor('background'))
  uploadTemplateBackground(
    @Param('id') imageId,
    @Param('uniqName') uniqName,
    @UploadedFile() background,
  ) {
    return this.imageService
      .uploadTemplateBackground(imageId, uniqName, background)
      .catch(err => err);
  }

  @Put(':id/template/:uniqName')
  @UseInterceptors(FileInterceptor('template'))
  uploadTemplate(@Param('id') imageId, @Param('uniqName') uniqName, @UploadedFile() template) {
    return this.imageService.uploadTemplate(imageId, uniqName, template).catch(err => err);
  }

  @Put(':id/updateTrendingNow')
  updateTrendingNow(@Param('id') id, @Body() reqBody) {
    return this.imageService.updateTrendingNow(id, reqBody.isTrendingNow).catch(err => err);
  }

  @Put(':id')
  toggleImageActive(@Param('id') id) {
    return this.imageService.toggleImageActive(id);
  }
}

export { ImageController };
