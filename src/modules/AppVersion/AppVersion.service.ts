import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { camelCase } from 'lodash';
import { SemVer } from 'semver';
import { Repository } from 'typeorm';

import { AppVersion } from '../AppVersion/AppVersion.entity';

@Injectable()
class AppVersionService {
  constructor(
    @InjectRepository(AppVersion) private readonly AppVerRepository: Repository<AppVersion>,
  ) {}

  getVersion(appName: string): Promise<any> {
    const queryBuilder = this.AppVerRepository.createQueryBuilder('appVersion');
    return queryBuilder
      .where({ isActive: true })
      .andWhere('appVersion.appName = :appName', { appName })
      .getOne()
      .then(version => version)
      .catch(err => err);
  }

  createVersion(appName: string, version: string): Promise<any> {
    const semanticVersion = new SemVer(version);
    return this.AppVerRepository.save({
      appName,
      majorVersion: semanticVersion.major,
      minorVersion: semanticVersion.minor,
      patchVersion: semanticVersion.patch,
    })
      .then(newVersion => newVersion)
      .catch(err => err);
  }

  incrementVersion(appName: string, verBump: string): Promise<any> {
    return this.AppVerRepository.increment({ appName }, camelCase(verBump), 1)
      .then(data => data)
      .catch(err => err);
  }
}

export { AppVersionService };
