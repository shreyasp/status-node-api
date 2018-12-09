'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const aws_sdk_1 = require('aws-sdk');
const fs_1 = require('fs');
const path_1 = require('path');
const AppConfig_service_1 = require('../modules/AppConfig/AppConfig.service');
function assumeS3Role(
  awsAccountId,
  roleName,
  stsSessionName,
  awsRegion,
  awsAction,
  awsResourceType,
  credentialsExpireDuration = 900,
  awsResourceName = '*',
) {
  return __awaiter(this, void 0, void 0, function*() {
    const awsCredentials = new aws_sdk_1.Credentials({
      accessKeyId: '',
      secretAccessKey: '',
    });
    const awsConfig = new AppConfig_service_1.AppConfigService(
      path_1.join(__dirname, '..', '..', `${process.env.NODE_ENV}.env`),
    );
    const sts = new aws_sdk_1.STS({
      endpoint: `https://sts.${awsRegion}.amazonaws.com`,
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      region: awsRegion,
    });
    const rolePolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'VisualEditor0',
          Effect: 'Allow',
          Action: awsAction,
          Resource: `arn:aws:s3:::${awsResourceType}/${awsResourceName}`,
        },
      ],
    };
    return new Promise((resolve, reject) => {
      sts.assumeRole(
        {
          RoleArn: `arn:aws:iam::${awsAccountId}:role/${roleName}`,
          RoleSessionName: stsSessionName,
          DurationSeconds: credentialsExpireDuration,
          Policy: JSON.stringify(rolePolicy),
        },
        (err, data) => {
          if (err) {
            reject({
              success: false,
              msg: 'Something went wrong while trying to acquire credentials',
              err,
            });
          } else if (!data) {
            reject({
              success: false,
              msg: 'Not able to get Temp Security Credentials',
            });
          } else {
            awsCredentials.accessKeyId = data.Credentials.AccessKeyId;
            awsCredentials.secretAccessKey = data.Credentials.SecretAccessKey;
            awsCredentials.sessionToken = data.Credentials.SessionToken;
            awsCredentials.expireTime = data.Credentials.Expiration;
            resolve(awsCredentials);
          }
        },
      );
    });
  });
}
exports.assumeS3Role = assumeS3Role;
function putS3Object(s3, region, bucketName, s3Key, file, useCloudFront = false) {
  return __awaiter(this, void 0, void 0, function*() {
    return new Promise((resolve, reject) => {
      const awsConfig = new AppConfig_service_1.AppConfigService(
        path_1.join(__dirname, '..', '..', `${process.env.NODE_ENV}.env`),
      );
      const params = {
        Bucket: bucketName,
        Key: s3Key,
        Body: typeof file === 'string' ? fs_1.readFileSync(file) : file,
        ACL: 'public-read',
      };
      s3.putObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else if (!data) {
          reject(null);
        } else {
          const s3Path = useCloudFront
            ? `${awsConfig.cloudFrontBaseUrl}/${s3Key}`
            : `${awsConfig.s3BaseUrl}/${s3Key}`;
          resolve(s3Path);
        }
      });
    });
  });
}
exports.putS3Object = putS3Object;
//# sourceMappingURL=aws-s3.utils.js.map
