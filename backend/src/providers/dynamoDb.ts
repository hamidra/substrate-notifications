import * as dynamooseClient from 'dynamoose';
import * as dynamoDB_creds from '../secrets/dynamoDb-creds-dev.json';

dynamooseClient.aws.sdk.config.update({
  accessKeyId: dynamoDB_creds.accessKeyId,
  secretAccessKey: dynamoDB_creds.secretAccessKey,
  region: dynamoDB_creds.region,
});

dynamooseClient.aws.sdk.config.logger = console;

export { dynamooseClient };
