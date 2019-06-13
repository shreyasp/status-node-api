import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LayerMaster } from './LayerMaster.entity';
import { Layer } from './TemplateImageLayer.entity';

@Injectable()
class LayerMasterService {
  constructor(
    @InjectRepository(LayerMaster) private readonly LayerMasterRepository: Repository<LayerMaster>,
  ) {}

  createLayerMaster(layerMaster: LayerMaster) {
    return this.LayerMasterRepository.save({ ...layerMaster })
      .then(createdLayerMasterObj => ({
        success: true,
        message: 'Created Layer Master Successfully',
        data: createdLayerMasterObj,
      }))
      .catch(err => ({
        success: false,
        message: 'Something went wrong while trying to create Layer Master',
        err,
      }));
  }

  getAllLayerMaster() {
    const queryBuilder = this.LayerMasterRepository.createQueryBuilder('layerMaster');
    return queryBuilder.getMany().then(data => ({
      success: true,
      message: 'Retrieved Layer Master records successfully',
      data,
    }));
  }
}

export { LayerMasterService };
