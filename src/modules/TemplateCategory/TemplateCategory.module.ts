import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './TemplateCategory.service';
import { CategoryController } from './TemplateCategory.controller';
import { Category } from './TemplateCategory.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Category,
        ]),
    ],
    controllers: [
        CategoryController,
    ],
    providers: [
        CategoryService,
    ],
})

class TemplateCategoryModule {}

export { TemplateCategoryModule };