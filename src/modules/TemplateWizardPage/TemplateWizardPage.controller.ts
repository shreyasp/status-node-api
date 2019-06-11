import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { WizardPageService } from './TemplateWizardPage.service';

@Controller('wizard-page')
class WizardPageController {
  constructor(private readonly wizardPageService: WizardPageService) {}
}

export { WizardPageController };
