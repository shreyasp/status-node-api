import { Credentials, STS } from 'aws-sdk';
import { createWriteStream, readFileSync } from 'fs';
import { readFileSync as jsonReadFileSync } from 'jsonfile';
import { split } from 'lodash';
import { parse as urlParse } from 'url';

import { AppConfigService } from '../modules/AppConfig/AppConfig.service';

/**
 * This function can be used to generate temporary credentials for performing actions
 * on AWS resources such S3, EC2 etc.
 * @param awsAccountId: AWS account ID to be used for accessing the STS service, it
 * should have established trust relationship with STS service in its IAM console.
 * @param roleName: IAM Role that is allowed to access the STS service.
 * @param stsSessionName: Session Name for creating STS Temporary Credentials
 * @param awsRegion: AWS region where STS credentials can be generated
 * @param awsAction: AWS Resource action for which Temporary credentials are required
 * @param awsResourceType: In case of S3, specify bucket name to be accessed by the AWS action
 * @param credentialsExpireDuration: Specifiy validity for Temporary Credentials in seconds,
 * default is 900 seconds, lower values are not allowed by AWS
 * @param awsResourceName: In case of S3, this can specific ket that needs to be accessed
 * default is *, access to all the Keys in the bucket.
 */
async function assumeS3Role(
  awsAccountId: string,
  roleName: string,
  stsSessionName: string,
  awsRegion: string,
  awsAction: string,
  awsResourceType: string,
  credentialsExpireDuration = 900,
  awsResourceName = '*',
): Promise<any> {
  // Read the config file for Credentials for STS User
  const awsCredentials: Credentials = new Credentials({
    accessKeyId: '',
    secretAccessKey: '',
  });

  const awsConfig = getAppConfig();

  // Create a new instance of Simple Token Service
  const sts = new STS({
    endpoint: `https://sts.${awsRegion}.amazonaws.com`,
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsRegion,
  });

  // Policy which will restrict the access only to test bucket
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

  // Assume Role
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
}

/**
 * This function will be used to put the given file from the path or buffer to the S3 Bucket and to the
 * specified Key name.
 * @param s3: AWS S3 object which contains security credentials for performing action on the requested
 * bucket or key. Example, new AWS.S3({accessKeyId: xxxxxxxx, secretAccessKey: xxxxxxxx, region: xxx})
 * @param bucketName: Name of the AWS bucket to which file needs to be uploaded
 * @param s3Key: Key name to which we need to upload the file
 * @param file: This can path file path or Buffer to be uploaded to given S3 Key
 */
async function putS3Object(
  s3: AWS.S3,
  region: string,
  bucketName: string,
  s3Key: string,
  file: Buffer | string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    // NOTE: If we pass file as path, then read from the path to convert into buffer or else
    // directly upload the buffer object
    const params = {
      Bucket: bucketName,
      Key: s3Key,
      Body: typeof file === 'string' ? readFileSync(file) : file,
      ACL: 'public-read',
    };

    s3.putObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else if (!data) {
        reject(null);
      } else {
        const s3Path = `https://s3.${region}.amazonaws.com/${bucketName}/${s3Key}`;
        resolve(s3Path);
      }
    });
  });
}

// async function getS3Object(s3: AWS.S3, s3URL: string): Promise<any> {
//   return new Promise((resolve, reject) => {
//     const parsedURL = urlParse(s3URL);
//     const bucketName = split(parsedURL.path, '/')[1];

//     const params = {
//       Bucket: bucketName,
//       Key: parsedURL.path,
//     };

//     const bckgndPath = join(__dirname, '..', '..', 'images', 'bckgnd.png');
//     const oStream = createWriteStream(bckgndPath);
//     s3.getObject(params)
//       .createReadStream()
//       .pipe(oStream);

//     oStream
//       .on('finish', () =>
//         resolve({ success: true, message: 'Downloaded file successfully from S3', bckgndPath }),
//       )
//       .on('error', err => reject(err));
//   });
// }

function getAppConfig() {
  return new AppConfigService().readAppConfig();
}

export { assumeS3Role };
export { putS3Object };
// export { getS3Object };
