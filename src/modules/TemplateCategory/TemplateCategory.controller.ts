import { Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './TemplateCategory.service';

@Controller('category')
class CategoryController {
    constructor(private readonly categoryService: CategoryService){}

    @Get()
    getAllCategories(): object {
        return this.categoryService.findAll();
    }

    @Post()
    createCategory(): object {
        
    }
}

export { CategoryController };