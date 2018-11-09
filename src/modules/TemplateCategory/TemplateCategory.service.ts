import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map as loMap, omit } from 'lodash';
import { Repository } from 'typeorm';

import { Category } from './TemplateCategory.entity';

@Injectable()
class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly CategoryRepository: Repository<Category>,
  ) {}

  // Retrieve all the active categories
  findAllCategories() {
    return this.CategoryRepository.find({ isActive: true })
      .then(categories => {
        return {
          success: true,
          message: 'Fetched all active categories successfully',
          data: loMap(categories, c => omit(c, ['EntId', 'isActive'])),
        };
      })
      .catch(err => err);
  }

  // Retrieve Category based on ID
  findOneCategory(id: number) {
    const queryBuilder = this.CategoryRepository.createQueryBuilder('category');
    return queryBuilder
      .where('id = :id', { id })
      .getOne()
      .then(category => {
        return {
          success: true,
          message: `Fetched Category with id:${id} successfully`,
          data: omit(category, ['EntId', 'isActive']),
        };
      })
      .catch(err => err);
  }

  // Create a new Category
  createCategory(createObj) {
    return this.CategoryRepository.save(createObj)
      .then(obj => obj)
      .catch(err => err);
  }

  // Update Category
  updateCategory(id, updateObj) {
    return this.CategoryRepository.update({ id }, { ...updateObj });
  }

  // Delete/Make Category In-active
  deactivateCategory(id) {
    return this.CategoryRepository.update({ id }, { isActive: false });
  }
}

export { CategoryService };
