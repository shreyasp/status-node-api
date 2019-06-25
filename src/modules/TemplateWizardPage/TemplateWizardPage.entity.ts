import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, ManyToOne, JoinTable } from 'typeorm';

import { CommonEntity } from '../../entities/common.entity';
import { Category } from '../TemplateCategory/TemplateCategory.entity';
import { LayerMaster } from '../TemplateImageLayer/LayerMaster.entity';

@Entity()
class WizardPage extends CommonEntity {
  @PrimaryGeneratedColumn()
  pageId: number;

  @Column({
    type: 'varchar',
    length: 127,
  })
  pageTitle: string;

  @Column({
    type: 'bigint',
  })
  pageNumber: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @ManyToOne(type => Category, category => category.id)
  category: Category;

  @ManyToMany(type => LayerMaster, layerMaster => layerMaster.wizardPages)
  @JoinTable()
  layerMasterIds: LayerMaster[];
}

export { WizardPage };
