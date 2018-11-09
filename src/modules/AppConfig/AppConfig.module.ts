import { Global, Module } from '@nestjs/common';

import { AppConfigService } from './AppConfig.service';

@Global()
@Module({
  exports: [AppConfigService],
  providers: [AppConfigService],
})
class AppConfigModule {}

export { AppConfigModule };
