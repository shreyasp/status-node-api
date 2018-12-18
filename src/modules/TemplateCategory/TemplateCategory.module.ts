import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigModule } from '../AppConfig/AppConfig.module';
import { CategoryController } from './TemplateCategory.controller';
import { Category } from './TemplateCategory.entity';
import { CategoryService } from './TemplateCategory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AppConfigModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
class TemplateCategoryModule {}

export { TemplateCategoryModule };
