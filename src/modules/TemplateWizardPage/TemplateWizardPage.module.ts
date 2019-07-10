import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WizardPage } from './TemplateWizardPage.entity';
import { WizardPageService } from './TemplateWizardPage.service';
import { WizardPageController } from './TemplateWizardPage.controller';

import { LayerMaster } from '../TemplateImageLayer/LayerMaster.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LayerMaster, WizardPage])],
  controllers: [WizardPageController],
  providers: [WizardPageService],
})
class WizardPageModule {}

export { WizardPageModule };
