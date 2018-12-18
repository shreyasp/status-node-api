import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor, UseInterceptors } from '@nestjs/common';

import { TemplateCategoryDTO } from './dto/TemplateCategory.dto';
import { CategoryService } from './TemplateCategory.service';

@Controller('category')
class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAllCategories(@Query() query): object {
    return this.categoryService.findAllCategories(query.page);
  }

  @Get(':id')
  getCategory(@Param('id') id): object {
    return this.categoryService.findOneCategory(id);
  }

  @Post()
  async createCategory(@Body() categoryDTO: TemplateCategoryDTO) {
    return this.categoryService
      .createCategory(categoryDTO)
      .then(category => category)
      .catch(err => err);
  }

  @Post(':id/categoryIcon')
  @UseInterceptors(FileInterceptor('icon'))
  uploadCategoryIcon(@Param('id') id, @UploadedFile() icon) {
    return this.categoryService
      .addUpdateCategoryIcon(id, icon)
      .then(category => category)
      .catch(err => err);
  }

  @Put(':id')
  updateCategory(@Param('id') id, @Body() categoryDTO: TemplateCategoryDTO) {
    return this.categoryService.updateCategory(id, categoryDTO);
  }

  @Delete(':id')
  deactivateCategory(@Param('id') id): object {
    return this.categoryService.deactivateCategory(id);
  }
}

export { CategoryController };
