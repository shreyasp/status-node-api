import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CategoryService } from './TemplateCategory.service';
import { TemplateCategoryDTO } from './dto/TemplateCategory.dto';

@Controller('category')
class CategoryController {
    constructor(private readonly categoryService: CategoryService){}

    @Get()
    getAllCategories(): object {
        return this.categoryService.findAllCategories();
    }

    @Get(':id')
    getCategory(@Param('id') id): object {
        return this.categoryService.findOneCategory(id);
    }

    @Post()
    async createCategory(@Body() categoryDTO: TemplateCategoryDTO) {
        return this.categoryService.createCategory(categoryDTO)
            .then((category) => category)
            .catch((err) => err);
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