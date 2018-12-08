import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import * as joi from 'joi';

export interface AppConfig {
  [key: string]: string;
}

export class AppConfigService {
  private readonly appConfig: AppConfig;

  constructor(filePath: string) {
    const conf = dotenv.parse(readFileSync(filePath));
    this.appConfig = this.validateInput(conf);
  }

  /**
   * Add a getter function whenever a new key is added to config
   * @param {string} key
   * @returns {string}
   * @memberof AppConfigService
   */
  get accessKeyID(): string {
    return this.appConfig.accessKeyID;
  }

  get secretAccessKey(): string {
    return this.appConfig.secretAccessKey;
  }

  get accountId(): string {
    return this.appConfig.accountId;
  }

  get bucketName(): string {
    return this.appConfig.bucketName;
  }

  get assumedRole(): string {
    return this.appConfig.assumedRole;
  }

  get awsRegion(): string {
    return this.appConfig.awsRegion;
  }

  get cloudFrontBaseUrl(): string {
    return this.appConfig.cloudFrontBaseUrl;
  }

  get s3BaseUrl(): string {
    return this.appConfig.s3BaseUrl;
  }

  /**
   * Every new configuration parameter added should have a validation in place
   * it can be default or custom
   */
  private validateInput(appConfig: AppConfig): AppConfig {
    const confSchema: joi.ObjectSchema = joi.object({
      NODE_ENV: joi
        .string()
        .valid(['development', 'production'])
        .default('development'),
      accessKeyId: joi.string().required(),
      secretAccessKey: joi.string().required(),
      accountId: joi.string().required(),
      bucketName: joi.string().default('status-app-prod'),
      assumedRole: joi.string().default('STS-Prod-Role'),
      awsRegion: joi.string().default('us-east-1'),
      cloudFrontBaseUrl: joi.string().default('https://d30edhuczthfyp.cloudfront.net'),
      s3BaseUrl: joi.string().default('https://status-app-prod.s3.amazonaws.com'),
    });

    const { error, value: validatedAppConfig } = joi.validate(appConfig, confSchema);

    if (error) throw new Error(`Config validation error: ${error.message}`);
    return validatedAppConfig;
  }
}
