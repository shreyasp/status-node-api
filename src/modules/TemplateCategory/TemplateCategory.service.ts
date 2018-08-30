import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './TemplateCategory.entity';
import _ from 'lodash';

@Injectable()
class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly CategoryRepository: Repository<Category>,
    ){}

    // Query Builder for building complex relational queries for the given
    // repository
    queryBuilder = this.CategoryRepository.createQueryBuilder('category');

    // Retrieve all the active categories
    findAllCategories() {
        return this.CategoryRepository.find({ common: { isActive: true } })
            .then((categories) => categories)
            .catch((err) => err);
    }

    // Retrieve Category based on ID
    findOneCategory(id: number) {
        return this.queryBuilder.where(
            'category.categoryId = :categoryId',
            {categoryId: id},
        )
        .getOne()
        .then((category) => category)
        .catch((err) => err);
    }

    // Create a new Category
    createCategory(createObj) {
        return this.CategoryRepository.save(createObj)
            .then((obj) => obj)
            .catch((err) => err);
    }

    // Update Category
    async updateCategory(id, updateObj) {
        return this.CategoryRepository.update(
            {categoryId: id}, {...updateObj},
        );
    }

    // Delete/Make Category In-active
    async deactivateCategory(id){
        return this.CategoryRepository.update(
            {categoryId: id}, {common: {isActive: false}},
        );
    }
}

export { CategoryService };