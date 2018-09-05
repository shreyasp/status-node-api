import { Controller, Get, Param, Post, Put, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor, UseInterceptors } from '@nestjs/common';

import { ImageService } from './TemplateImage.service';

@Controller('image')
class ImageController {
    constructor(private readonly imageService: ImageService){}

    @Get()
    getAllImages(): object {
        return this.imageService.findAllImages();
    }

    @Get(':id')
    getImage(@Param('id') id): object {
        return this.imageService.findOneImage(id);
    }

    // TODO: Image creation to be done
    // @Post()

    @Put(':id')
    toggleImageActive(@Param('id') id) {
        return this.imageService.toggleImageActive(id);
    }
}

export { ImageController };