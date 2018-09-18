import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Layer } from './TemplateImageLayer.entity';
import { LayerService } from './TemplateImageLayer.service';
import { LayerController } from './TemplateImageLayer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Layer])],
  controllers: [LayerController],
  providers: [LayerService],
})
class TemplateLayerModule {}

export { TemplateLayerModule };
