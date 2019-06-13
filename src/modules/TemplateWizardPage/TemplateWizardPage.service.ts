import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { DeepPartial, Repository } from 'typeorm';

import { Category } from '../TemplateCategory/TemplateCategory.entity';
import { WizardPage } from './TemplateWizardPage.entity';

@Injectable()
class WizardPageService {
  constructor(
    @InjectRepository(WizardPage) private readonly wizardPageRepository: Repository<WizardPage>,
  ) {}

  getAllWizardPagesByCategory(category: DeepPartial<Category>) {
    const queryBuilder = this.wizardPageRepository.createQueryBuilder('wizardPage');
    return queryBuilder
      .innerJoinAndSelect('wizardPage.category', 'category', 'wizardPage.category = :category', {
        category,
      })
      .where({ isActive: true })
      .getManyAndCount()
      .then(data => {
        const wizardPages = data[0];
        const totalWizardPages = data[1];

        if (isEmpty(wizardPages)) {
          return {
            success: true,
            message: 'No wizard pages present for given category in the database',
            data: {
              wizardPages,
              totalWizardPages,
            },
          };
        }
      })
      .catch(err => ({
        success: false,
        message: 'Something went wrong while trying to retrieve wizard pages',
        err,
      }));
  }
}

export { WizardPageService };
