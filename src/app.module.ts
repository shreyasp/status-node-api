import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PingController } from './modules/Ping/ping.controller';
import { TemplateCategoryModule } from './modules/TemplateCategory/TemplateCategory.module';
import { TemplateFontModule } from './modules/TemplateFont/TemplateFont.module';
import { TemplateImageModule } from './modules/TemplateImage/TemplateImage.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TemplateCategoryModule,
    TemplateFontModule,
    TemplateImageModule,
  ],
  controllers: [AppController, PingController],
  providers: [AppService],
})

export class AppModule {
  constructor(private readonly connection: Connection){}
}
