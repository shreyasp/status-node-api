import { Body, Controller, Get, Post } from '@nestjs/common';

import { LayerMasterService } from './LayerMaster.service';

@Controller('layerMaster')
class LayerMasterController {
  constructor(private readonly layerMasterService: LayerMasterService) {}

  @Get()
  getLayerMaster(): object {
    return this.layerMasterService.getAllLayerMaster();
  }

  @Post()
  createLayerMaster(@Body() reqBody): object {
    return this.layerMasterService.createLayerMaster(reqBody);
  }
}

export { LayerMasterController };
