import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigModule } from '../AppConfig/AppConfig.module';
import { FontController } from './TemplateFont.controller';
import { Font } from './TemplateFont.entity';
import { FontService } from './TemplateFont.service';

@Module({
  imports: [TypeOrmModule.forFeature([Font]), AppConfigModule],
  controllers: [FontController],
  providers: [FontService],
})
class TemplateFontModule {}

export { TemplateFontModule };
