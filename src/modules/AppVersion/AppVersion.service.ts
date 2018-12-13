import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { camelCase } from 'lodash';
import { omit, startCase } from 'lodash';
import { SemVer } from 'semver';
import { Repository } from 'typeorm';

import { AppVersion } from '../AppVersion/AppVersion.entity';

@Injectable()
class AppVersionService {
  constructor(
    @InjectRepository(AppVersion) private readonly AppVerRepository: Repository<AppVersion>,
  ) {}

  getVersion(clientName: string): Promise<any> {
    const queryBuilder = this.AppVerRepository.createQueryBuilder('appVersion');
    return queryBuilder
      .where({ isActive: true })
      .andWhere('appVersion.clientName = :clientName', { clientName })
      .getOne()
      .then(version => {
        if (!version) {
          return {
            success: true,
            message: `No version found for the ${clientName} client`,
            data: null,
          };
        }

        return {
          success: true,
          message: `Fetched version successfuly for ${clientName} client`,
          data: omit(version, ['EntId', 'id', 'isActive']),
        };
      })
      .catch(err => ({
        success: false,
        message: `Something went wrong while trying to fetch version for ${clientName}`,
        err,
      }));
  }

  createVersion(clientName: string, version: string): Promise<any> {
    const semanticVersion = new SemVer(version);
    return this.AppVerRepository.save({
      clientName,
      majorVersion: semanticVersion.major,
      minorVersion: semanticVersion.minor,
      patchVersion: semanticVersion.patch,
    })
      .then(newVersion => ({
        success: true,
        message: `Created a new version for ${clientName}`,
        data: omit(newVersion, ['id', 'EntId']),
      }))
      .catch(err => ({
        success: false,
        message: `Something went while trying to create a new version for ${clientName}`,
        err,
      }));
  }

  incrementVersion(clientName: string, versionType: string): Promise<any> {
    return this.AppVerRepository.increment({ clientName }, camelCase(versionType), 1)
      .then(() => ({
        success: true,
        message: `Successfully incremented ${startCase(versionType)} for ${clientName}`,
      }))
      .catch(err => ({
        success: false,
        message: `Something went wrong while trying to increment ${startCase(
          versionType,
        )} for ${clientName}`,
        err,
      }));
  }
}

export { AppVersionService };
