import { Controller, Get, Param, Post, Put, UploadedFiles, Body } from '@nestjs/common';
import { FilesInterceptor, UseInterceptors } from '@nestjs/common';

import { ImageService } from './TemplateImage.service';
import { TemplateImageDTO } from './dto/TemplateImage.dto';

@Controller('image')
class ImageController {
    constructor(private readonly imageService: ImageService){}

    createImageCallback = (err: any, results: any) => {
        if (err) return err;

        return results;
    }

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
    createImage(@Body() imageName, @UploadedFiles() images): object {
        this.imageService.createImage(imageName, images);
        return {};
    }

    @Put(':id')
    toggleImageActive(@Param('id') id) {
        return this.imageService.toggleImageActive(id);
    }
}

export { ImageController };