import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { DeepPartial, Repository } from 'typeorm';

import { Category } from '../TemplateCategory/TemplateCategory.entity';
import { WizardPage } from './TemplateWizardPage.entity';
import { LayerMaster } from '../TemplateImageLayer/LayerMaster.entity';

@Injectable()
class WizardPageService {
  constructor(
    @InjectRepository(WizardPage) private readonly wizardPageRepository: Repository<WizardPage>,
    @InjectRepository(LayerMaster) private readonly layerMasterRepository: Repository<LayerMaster>,
  ) {}

  getAllWizardPagesByCategory(category: DeepPartial<Category>) {
    const queryBuilder = this.wizardPageRepository.createQueryBuilder('wizardPage');
    return queryBuilder
      .innerJoinAndSelect('wizardPage.category', 'category', 'wizardPage.category = :category', {
        category,
      })
      .leftJoinAndSelect('wizardPage.layerMasters', 'layerMasters')
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
        } else {
          return {
            success: true,
            message: 'Successfully fetched wizard pages for the given category',
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

  createWizardPageByCategory(
    category: DeepPartial<Category>,
    wizPage: WizardPage,
    layerMasterIds: DeepPartial<LayerMaster[]>,
  ) {
    const queryBuilder = this.layerMasterRepository.createQueryBuilder('layerMaster');

    return queryBuilder
      .where('layerMaster.layerMasterId IN(:...layerMasterIds)', { layerMasterIds })
      .getMany()
      .then(data => {
        return this.wizardPageRepository
          .save({
            ...wizPage,
            category,
            layerMasters: data,
          })
          .then(createdWizPage => ({
            success: true,
            message: 'Created Wizard Page successfully',
            data: createdWizPage,
          }))
          .catch(err => ({
            success: false,
            message: 'Something went wrong while creating a Wizard Page',
            err,
          }));
      })
      .catch(err => err);
  }
}

export { WizardPageService };
