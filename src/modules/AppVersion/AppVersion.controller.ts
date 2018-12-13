import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { concat } from 'lodash';

import { AppVersionService } from './AppVersion.service';

@Controller('appVersion')
class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @Get(':clientName')
  getAppVersion(@Param('clientName') clientName): object {
    return this.appVersionService.getVersion(clientName);
  }

  @Post(':clientName/create/')
  createAppVersion(@Param('clientName') clientName, @Body() reqBody): object {
    return this.appVersionService.createVersion(clientName, reqBody.version);
  }

  @Post(':clientName/incr/:versionType')
  incrementVersion(@Param('clientName') clientName, @Param('versionType') versionType): object {
    return this.appVersionService.incrementVersion(clientName, `${versionType}Version`);
  }
}

export { AppVersionController };
