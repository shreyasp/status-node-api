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

    findAll(): Category[] {
        return this.CategoryRepository.find();
    }

    create(name: string, displayName: string): Category {
        this.CategoryRepository.create({
            name: 
        })
    }
}

export { CategoryService };