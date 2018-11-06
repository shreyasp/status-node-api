import { Injectable } from '@nestjs/common';
import { readFileSync as jsonReadSync } from 'jsonfile';
import { join } from 'path';

@Injectable()
class AppConfigService {
  public readonly appConfig: any = {};
  configPath: string = join(__dirname, 'config', `aws-config.dev.json`);

  readAppConfig(): any {
    return jsonReadSync(this.configPath);
  }
}

export { AppConfigService };
