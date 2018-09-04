import { Controller, Get, Param, Post, Put, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor, UseInterceptors } from '@nestjs/common';

import { TemplateFontDTO } from './dto/TemplateFont.dto';
import { FontService } from './TemplateFont.service';

@Controller('font')
class FontController {
    constructor(private readonly fontService: FontService){}

    @Get()
    getAllFonts(): object {
        return this.fontService.findAllFonts();
    }

    @Get(':id')
    getFont(@Param('id') id): object {
        return this.fontService.findOneFont(id);
    }

    @Post()
    @UseInterceptors(FilesInterceptor('font'))
    createFont(@UploadedFiles() fontFiles) {
        const createObj: any = {};
        this.fontService.createFont(fontFiles, createObj);

        if (!createObj.success) {
            console.log(createObj);
            return (createObj.err);
        } else {
            return({
                success: true,
                message: 'Fonts created and uploaded successfully',
            });
        }
    }

    @Put(':id')
    toggleFontActive(@Param('id') id) {
        return this.fontService.toggleFontActive(id);
    }
}

export { FontController };