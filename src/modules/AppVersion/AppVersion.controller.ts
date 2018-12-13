import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { concat } from 'lodash';

import { AppVersionService } from './AppVersion.service';

@Controller('appVersion')
class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @Get(':appName')
  getAppVersion(@Param('appName') appName): object {
    return this.appVersionService.getVersion(appName);
  }

  @Post(':appName/create/')
  createAppVersion(@Param('appName') appName, @Body() reqBody): object {
    return this.appVersionService.createVersion(appName, reqBody.version);
  }

  @Post(':appName/incr/:version')
  incrementMajorVersion(@Param('appName') appName, @Param('version') version): object {
    return this.appVersionService.incrementVersion(appName, `${version}Version`);
  }
}

export { AppVersionController };
