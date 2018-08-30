import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile } from '@nestjs/common';
import { FileInterceptor, UseInterceptors } from '@nestjs/common';

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
    @UseInterceptors(FileInterceptor('font'))
    createFont(@UploadedFile() fontFile) {
        return this.fontService.createFont(fontFile);
    }

    @Put(':id')
    toggleFontActive(@Param('id') id) {
        return this.fontService.toggleFontActive(id);
    }
}

export { FontController };