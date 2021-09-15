import { dynamooseClient } from '../providers/dynamoDb';

const PalletSchema = new dynamooseClient.Schema({
  name: String,
  events: { type: Array, schema: [String] },
});

export { PalletSchema };
