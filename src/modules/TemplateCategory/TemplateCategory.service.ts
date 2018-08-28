import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './TemplateCategory.entity';

@Injectable()
class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly CategoryRepository: Repository<Category>,
    ){}

    // Query Builder for building complex relational queries for the given
    // repository
    queryBuilder = this.CategoryRepository.createQueryBuilder("category");

    // Retrieve all the categories
    findAll(): Category[] {
        return this.CategoryRepository.find();
    }

    // Retrieve Category based on ID
    findOne(id: number): Category {
        return this.queryBuilder.where(
            "category.categoryId = :categoryId",
            {categoryId: id}
        )
        .getOne()
        .then((category) => category)
        .catch((err) => err);
    }

    // Create a new Category
    create(categoryCreateObj) {
        return this.CategoryRepository.save(categoryCreateObj)
            .then((obj) => obj)
            .catch((err) => err);
    }

    // Update Category

    // Delete/Make Category In-active
}

export { CategoryService };