'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const dotenv = require('dotenv');
const fs_1 = require('fs');
const joi = require('joi');
class AppConfigService {
  constructor(filePath) {
    const conf = dotenv.parse(fs_1.readFileSync(filePath));
    this.appConfig = this.validateInput(conf);
  }
  get accessKeyId() {
    return this.appConfig.accessKeyId;
  }
  get secretAccessKey() {
    return this.appConfig.secretAccessKey;
  }
  get accountId() {
    return this.appConfig.accountId;
  }
  get bucketName() {
    return this.appConfig.bucketName;
  }
  get assumedRole() {
    return this.appConfig.assumedRole;
  }
  get awsRegion() {
    return this.appConfig.awsRegion;
  }
  get cloudFrontBaseUrl() {
    return this.appConfig.cloudFrontBaseUrl;
  }
  get s3BaseUrl() {
    return this.appConfig.s3BaseUrl;
  }
  validateInput(appConfig) {
    const confSchema = joi.object({
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
exports.AppConfigService = AppConfigService;
//# sourceMappingURL=AppConfig.service.js.map
