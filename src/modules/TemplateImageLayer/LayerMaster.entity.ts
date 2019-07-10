import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../../entities/common.entity';
import { WizardPage } from '../TemplateWizardPage/TemplateWizardPage.entity';

@Entity()
class LayerMaster extends CommonEntity {
  @PrimaryGeneratedColumn()
  layerMasterId: number;

  @Column({
    type: 'varchar',
    length: 63,
  })
  layerMasterName: string;

  @Column({
    type: 'varchar',
    length: 63,
  })
  layerMasterDisplayName: string;
}

export { LayerMaster };
