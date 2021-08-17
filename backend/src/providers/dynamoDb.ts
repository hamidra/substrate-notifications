import * as dynamooseClient from 'dynamoose';
import * as creds from '../secrets/dynamoDb-creds.json';
console.log(process.cwd());
dynamooseClient.aws.sdk.config.loadFromPath(
  './src/secrets/dynamoDb-creds.json'
);

dynamooseClient.aws.sdk.config.logger = console;

export { dynamooseClient };
