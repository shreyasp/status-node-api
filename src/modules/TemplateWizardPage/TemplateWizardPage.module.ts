import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WizardPage } from './TemplateWizardPage.entity';
import { WizardPageService } from './TemplateWizardPage.service';
import { WizardPageController } from './TemplateWizardPage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WizardPage])],
  controllers: [WizardPageController],
  providers: [WizardPageService],
})
class WizardPageModule {}

export { WizardPageModule };
