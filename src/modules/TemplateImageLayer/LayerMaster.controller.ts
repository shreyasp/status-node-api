import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { LayerMasterService } from './LayerMaster.service';

@Controller('layerMaster')
class LayerMasterController {
  constructor(private readonly layerService: LayerMasterService) {}
}

export { LayerMasterController };
