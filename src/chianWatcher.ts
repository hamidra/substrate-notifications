/**
 * A chain watcher to subscribe to chain events.
 */

// Import the API
import { ApiPromise, WsProvider } from '@polkadot/api';

const chainUrl = 'wss://rpc.polkadot.io';

export default {
  start: async (eventHub: any) => {
    const wsProvider = new WsProvider(chainUrl);
    // Create our API with a default connection to the local node
    const api = await ApiPromise.create({ provider: wsProvider });

    // Subscribe to system events via storage
    api.query.system.events((events) => {
      console.log(`\nReceived ${events.length} events:`);
      eventHub.send(events);
    });
  },
};
