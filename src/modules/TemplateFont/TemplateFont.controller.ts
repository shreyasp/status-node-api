import { Controller, Get, Param, Post, Put, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor, UseInterceptors } from '@nestjs/common';

import { TemplateFontDTO } from './dto/TemplateFont.dto';
import { FontService } from './TemplateFont.service';

@Controller('font')
class FontController {
  constructor(private readonly fontService: FontService) {}

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
    return this.fontService.createFont(fontFiles);
  }

  @Put(':id')
  toggleFontActive(@Param('id') id) {
    return this.fontService.toggleFontActive(id);
  }
}

export { FontController };
