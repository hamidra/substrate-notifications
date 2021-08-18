import { dynamooseClient } from '../providers/dynamoDb';

const subscriptionSchema = new dynamooseClient.Schema({
  address: String,
  nonce: String,
  email: String,
  pallets: { type: Set, schema: [String] },
});

export default dynamooseClient.model('Subscription', subscriptionSchema);
