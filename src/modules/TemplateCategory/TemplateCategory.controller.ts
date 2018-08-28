import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoryService } from './TemplateCategory.service';
import { TemplateCategoryDTO } from './dto/TemplateCategory.dto';

@Controller('category')
class CategoryController {
    constructor(private readonly categoryService: CategoryService){}

    @Get()
    getAllCategories(): object {
        return this.categoryService.findAll();
    }

    @Get(':id')
    getCategory(@Param('id') id): object {
        return this.categoryService.findOne(id);
    }

    @Post()
    async createCategory(@Body() categoryDTO: TemplateCategoryDTO) {
        return this.categoryService.create(categoryDTO)
            .then((category) => category)
            .catch((err) => err);
    }
}

export { CategoryController };