import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Layer } from './TemplateImageLayer.entity';
import { LayerMaster } from './LayerMaster.entity';

@Injectable()
class LayerMasterService {
  constructor(
    @InjectRepository(LayerMaster) private readonly LayerMasterRepository: Repository<LayerMaster>,
  ) {}
}

export { LayerMasterService };
