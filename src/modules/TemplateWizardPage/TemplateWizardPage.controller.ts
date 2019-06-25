import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { WizardPageService } from './TemplateWizardPage.service';

@Controller('wizard-page')
class WizardPageController {
  constructor(private readonly wizardPageService: WizardPageService) {}

  @Get()
  getAllWizardPagesByCategory(@Query() query): object {
    return this.wizardPageService.getAllWizardPagesByCategory(query.categoryId);
  }

  @Post()
  createWizardByCategory(@Body() req): object {
    return this.wizardPageService.createWizardPageByCategory(
      req.category,
      req.wizardPage,
      req.layerMasterIds,
    );
  }
}

export { WizardPageController };
