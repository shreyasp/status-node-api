import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WizardPage } from './TemplateWizardPage.entity';

@Injectable()
class WizardPageService {
  constructor(
    @InjectRepository(WizardPage) private readonly WizardPageRepository: Repository<WizardPage>,
  ) {}
}

export { WizardPageService };
