import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Layer } from './TemplateImageLayer.entity';
import { LayerService } from './TemplateImageLayer.service';
import { LayerController } from './TemplateImageLayer.controller';

import { LayerMaster } from './LayerMaster.entity';
import { LayerMasterService } from './LayerMaster.service';
import { LayerMasterController } from './LayerMaster.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Layer, LayerMaster])],
  controllers: [LayerController, LayerMasterController],
  providers: [LayerService, LayerMasterService],
})
class TemplateLayerModule {}

export { TemplateLayerModule };
