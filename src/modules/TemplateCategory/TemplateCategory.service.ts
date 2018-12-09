import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ceil, isEmpty, map as loMap, omit, toNumber } from 'lodash';
import { Repository } from 'typeorm';

import { Category } from './TemplateCategory.entity';

@Injectable()
class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly CategoryRepository: Repository<Category>,
  ) {}

  // Retrieve all the active categories
  findAllCategories(page: number = 1) {
    const queryBuilder = this.CategoryRepository.createQueryBuilder('category');
    const offset = (page - 1) * 10;
    return queryBuilder
      .where({ isActive: true })
      .limit(10)
      .offset(offset)
      .getManyAndCount()
      .then(data => {
        /**
         * getManyAndCount returns array with first element as data and
         * second element as total number of objects irrespective of the
         * limit value prescribed.
         */
        const categories = data[0];
        const totalCategories = data[1];

        if (isEmpty(categories)) {
          return {
            success: true,
            message: 'No Category objects present in the database',
            data: {
              categories: [],
              totalPages: 1,
              currentPage: 1,
            },
          };
        }

        return {
          success: true,
          message: 'Fetched all active categories successfully',
          data: {
            categories: loMap(categories, c => omit(c, ['EntId', 'isActive'])),
            totalPages: ceil(totalCategories / 10),
            currentPage: toNumber(page),
          },
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
