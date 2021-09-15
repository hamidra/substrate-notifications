import { dynamooseClient } from '../providers/dynamoDb';
import { PalletSchema } from './pallet';
const SubscriptionSchema = new dynamooseClient.Schema({
  address: String,
  nonce: String,
  auth_nonce: { type: Set, schema: [String] },
  auth_tokens: { type: Set, schema: [String] },
  email: String,
  pallets: { type: Array, schema: [{ type: Object, schema: PalletSchema }] },
});

const SubscriptionModel = dynamooseClient.model(
  'Subscription',
  SubscriptionSchema
);

export { SubscriptionModel, SubscriptionSchema };
