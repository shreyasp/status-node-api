import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PingController } from './modules/Ping/ping.controller';
import { TemplateCategoryModule } from './modules/TemplateCategory/TemplateCategory.module';
import { EditImageModule } from './modules/TemplateEdit/TemplateEdit.module';
import { TemplateFontModule } from './modules/TemplateFont/TemplateFont.module';
import { TemplateImageModule } from './modules/TemplateImage/TemplateImage.module';
import { TemplateLayerModule } from './modules/TemplateImageLayer/TemplateImageLayer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TemplateCategoryModule,
    TemplateFontModule,
    TemplateImageModule,
    EditImageModule,
    TemplateLayerModule,
  ],
  controllers: [AppController, PingController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
