import * as dynamooseClient from 'dynamoose';
dynamooseClient.aws.sdk.config.update({
  accessKeyId: 'AKID',
  secretAccessKey: 'SECRET',
  region: 'us-east-1',
});

export { dynamooseClient };
