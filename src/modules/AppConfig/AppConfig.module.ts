import { Module } from '@nestjs/common';
import { join } from 'path';

import { AppConfigService } from './AppConfig.service';

@Module({
  providers: [
    {
      provide: AppConfigService,
      useValue: new AppConfigService(
        join(__dirname, '..', '..', '..', `${process.env.NODE_ENV}.env`),
      ),
    },
  ],
  exports: [AppConfigService],
})
export class AppConfigModule {}
