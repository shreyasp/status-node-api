import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PingController } from './controllers/ping.controller';

@Module({
  imports: [],
  controllers: [AppController, PingController],
  providers: [AppService],
})
export class AppModule {}
