import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppVersionController } from './AppVersion.controller';
import { AppVersion } from './AppVersion.entity';
import { AppVersionService } from './AppVersion.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppVersion])],
  controllers: [AppVersionController],
  providers: [AppVersionService],
})
class AppVersionModule {}

export { AppVersionModule };
