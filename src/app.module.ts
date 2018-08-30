import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PingController } from './modules/Ping/ping.controller';
import { TemplateCategoryModule } from './modules/TemplateCategory/TemplateCategory.module';
import { TemplateFontModule } from './modules/TemplateFont/TemplateFont.module';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TemplateCategoryModule,
    TemplateFontModule,
  ],
  controllers: [AppController, PingController],
  providers: [AppService],
})

export class AppModule {
  constructor(private readonly connection: Connection){}
}
