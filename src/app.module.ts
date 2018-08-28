import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PingController } from 'modules/Ping/ping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateCategoryModule } from 'modules/TemplateCategory/TemplateCategory.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TemplateCategoryModule,
  ],
  controllers: [AppController, PingController],
  providers: [AppService],
})
export class AppModule {}
