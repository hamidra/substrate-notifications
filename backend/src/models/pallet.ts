import { dynamooseClient } from '../providers/dynamoDb';

const palletSchema = new dynamooseClient.Schema({
  name: String,
  events: { type: Set, schema: [String] },
});

export default dynamooseClient.model('Subscription', palletSchema);
