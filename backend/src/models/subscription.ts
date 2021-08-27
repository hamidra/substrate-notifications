import { dynamooseClient } from '../providers/dynamoDb';

const subscriptionSchema = new dynamooseClient.Schema({
  address: String,
  nonce: String,
  auth_nonce: { type: Set, schema: [String] },
  auth_tokens: { type: Set, schema: [String] },
  email: String,
  pallets: { type: Set, schema: [String] },
});

export default dynamooseClient.model('Subscription', subscriptionSchema);
